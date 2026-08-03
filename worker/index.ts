/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ANALYTICS_REPORT_KEY: string;
  ANALYTICS_SALT: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const analyticsEncoder = new TextEncoder();

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

function normalizeAnalyticsPath(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  const path = value.split(/[?#]/, 1)[0].slice(0, 240);
  if (path.startsWith("/api/") || path.startsWith("/_")) return null;
  return path;
}

function normalizeReferrerHost(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  try {
    return new URL(value).hostname.toLowerCase().slice(0, 160);
  } catch {
    return "";
  }
}

async function dailyVisitorHash(date: string, request: Request, salt: string) {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    analyticsEncoder.encode(`${date}|${ip}|${userAgent}|${salt}`),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function recordAnalytics(request: Request, env: Env) {
  try {
    if (!env.ANALYTICS_SALT || !env.DB) return new Response(null, { status: 204 });
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 2048) return new Response(null, { status: 204 });

    const payload = (await request.json()) as { path?: unknown; referrer?: unknown };
    const path = normalizeAnalyticsPath(payload.path);
    if (!path) return new Response(null, { status: 204 });

    const eventDate = new Date().toISOString().slice(0, 10);
    const visitorHash = await dailyVisitorHash(eventDate, request, env.ANALYTICS_SALT);
    await env.DB.prepare(
      "INSERT INTO page_views (event_date, path, referrer_host, visitor_hash) VALUES (?, ?, ?, ?)",
    ).bind(eventDate, path, normalizeReferrerHost(payload.referrer), visitorHash).run();
  } catch {
    // Analytics must never affect the calculator experience.
  }

  return new Response(null, { status: 204 });
}

async function analyticsReport(request: Request, env: Env) {
  const suppliedKey = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!env.ANALYTICS_REPORT_KEY || !safeEqual(env.ANALYTICS_REPORT_KEY, suppliedKey)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startDate = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [totals, daily, topPages, topReferrers] = await env.DB.batch([
    env.DB.prepare(
      "SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS daily_unique_visitors FROM page_views WHERE event_date >= ?",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT event_date AS date, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors FROM page_views WHERE event_date >= ? GROUP BY event_date ORDER BY event_date",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT path, COUNT(*) AS views FROM page_views WHERE event_date >= ? GROUP BY path ORDER BY views DESC LIMIT 20",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT referrer_host AS host, COUNT(*) AS views FROM page_views WHERE event_date >= ? AND referrer_host <> '' GROUP BY referrer_host ORDER BY views DESC LIMIT 20",
    ).bind(startDate),
  ]);

  return Response.json(
    {
      period: { days: 30, startDate, endDate: new Date().toISOString().slice(0, 10) },
      totals: totals.results[0] ?? { views: 0, daily_unique_visitors: 0 },
      daily: daily.results,
      topPages: topPages.results,
      topReferrers: topReferrers.results,
    },
    { headers: { "cache-control": "no-store" } },
  );
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/analytics") {
      if (request.method === "POST") return recordAnalytics(request, env);
      if (request.method === "GET") return analyticsReport(request, env);
      return new Response(null, { status: 405, headers: { allow: "GET, POST" } });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
