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

const crawlerSignatures = [
  { name: "OpenAI Search", patterns: ["oai-searchbot", "chatgpt-user"] },
  { name: "Perplexity", patterns: ["perplexitybot", "perplexity-user"] },
  { name: "Google", patterns: ["googlebot"] },
  { name: "Bing", patterns: ["bingbot"] },
  { name: "Anthropic", patterns: ["claudebot", "claude-web"] },
  { name: "Apple", patterns: ["applebot"] },
  { name: "Common Crawl", patterns: ["ccbot"] },
] as const;

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

function normalizeCampaignValue(value: unknown) {
  return typeof value === "string" ? value.toLowerCase().trim().slice(0, 100) : "";
}

function detectCrawler(userAgent: string) {
  const normalized = userAgent.toLowerCase();
  return crawlerSignatures.find((crawler) => crawler.patterns.some((pattern) => normalized.includes(pattern)))?.name ?? "";
}

function classifySource(referrerHost: string, utmSource: string) {
  const source = `${utmSource} ${referrerHost}`.toLowerCase();
  if (source.includes("chatgpt") || source.includes("openai")) return "ChatGPT";
  if (source.includes("perplexity")) return "Perplexity";
  if (source.includes("copilot")) return "Copilot";
  if (source.includes("taxmathkit")) return "TaxMathKit";
  if (source.includes("google")) return "Google";
  if (source.includes("bing")) return "Bing";
  if (source.includes("github")) return "GitHub";
  if (source.includes("reddit")) return "Reddit";
  if (source.includes("linkedin")) return "LinkedIn";
  if (referrerHost) return "Other referral";
  return "Direct / unknown";
}

function isCrawlerContentPath(path: string) {
  return path === "/" || [
    "/tools/",
    "/guides",
    "/topics/",
    "/embed/",
    "/resources",
    "/about",
    "/privacy",
    "/sitemap.xml",
    "/robots.txt",
    "/llms.txt",
  ].some((prefix) => path.startsWith(prefix));
}

async function recordCrawlerHit(request: Request, env: Env, crawler: string) {
  try {
    if (!env.DB) return;
    const url = new URL(request.url);
    const path = normalizeAnalyticsPath(url.pathname);
    if (!path || !isCrawlerContentPath(path)) return;
    await env.DB.prepare(
      "INSERT INTO crawler_hits (event_date, crawler, path) VALUES (?, ?, ?)",
    ).bind(new Date().toISOString().slice(0, 10), crawler, path).run();
  } catch {
    // Crawler analytics must never affect page delivery.
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

    const crawler = detectCrawler(request.headers.get("user-agent") ?? "");
    if (crawler) return new Response(null, { status: 204 });

    const payload = (await request.json()) as {
      path?: unknown;
      eventType?: unknown;
      eventLabel?: unknown;
      sourceHost?: unknown;
      referrer?: unknown;
      isInternal?: unknown;
      utmSource?: unknown;
      utmMedium?: unknown;
    };
    const path = normalizeAnalyticsPath(payload.path);
    if (!path) return new Response(null, { status: 204 });

    const eventDate = new Date().toISOString().slice(0, 10);
    const visitorHash = await dailyVisitorHash(eventDate, request, env.ANALYTICS_SALT);
    const allowedEvents = new Set(["tool_open", "calculation_completed", "copy_result", "guide_to_tool", "embed_view"]);
    const eventType = typeof payload.eventType === "string" && allowedEvents.has(payload.eventType) ? payload.eventType : "";
    if (eventType) {
      const eventLabel = typeof payload.eventLabel === "string" ? payload.eventLabel.trim().slice(0, 160) : "";
      const sourceHost = normalizeReferrerHost(payload.sourceHost);
      await env.DB.prepare(
        "INSERT INTO interaction_events (event_date, path, event_type, event_label, source_host, visitor_hash, is_internal) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).bind(eventDate, path, eventType, eventLabel, sourceHost, visitorHash, payload.isInternal === true ? 1 : 0).run();
      return new Response(null, { status: 204 });
    }
    const referrerHost = normalizeReferrerHost(payload.referrer);
    const utmSource = normalizeCampaignValue(payload.utmSource);
    await env.DB.prepare(
      "INSERT INTO page_views (event_date, path, referrer_host, source_channel, visitor_hash, is_internal) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(
      eventDate,
      path,
      referrerHost,
      classifySource(referrerHost, utmSource),
      visitorHash,
      payload.isInternal === true ? 1 : 0,
    ).run();
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
  const [
    totals,
    internalTotals,
    historicalTotals,
    daily,
    internalDaily,
    historicalDaily,
    topPages,
    topReferrers,
    sourceChannels,
    crawlerTotals,
    crawlerDaily,
    topCrawlers,
    crawlerTopPages,
    eventTotals,
    eventTopPages,
    embedSources,
  ] = await env.DB.batch([
    env.DB.prepare(
      "SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS daily_unique_visitors FROM page_views WHERE event_date >= ? AND is_internal = 0",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS daily_unique_visitors FROM page_views WHERE event_date >= ? AND is_internal = 1",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS daily_unique_visitors FROM page_views WHERE event_date >= ? AND is_internal IS NULL",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT event_date AS date, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors FROM page_views WHERE event_date >= ? AND is_internal = 0 GROUP BY event_date ORDER BY event_date",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT event_date AS date, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors FROM page_views WHERE event_date >= ? AND is_internal = 1 GROUP BY event_date ORDER BY event_date",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT event_date AS date, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors FROM page_views WHERE event_date >= ? AND is_internal IS NULL GROUP BY event_date ORDER BY event_date",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT path, COUNT(*) AS views FROM page_views WHERE event_date >= ? AND is_internal = 0 GROUP BY path ORDER BY views DESC LIMIT 20",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT referrer_host AS host, COUNT(*) AS views FROM page_views WHERE event_date >= ? AND is_internal = 0 AND referrer_host <> '' GROUP BY referrer_host ORDER BY views DESC LIMIT 20",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT CASE WHEN source_channel = '' THEN CASE WHEN referrer_host = '' THEN 'Direct / unknown' ELSE 'Other referral' END ELSE source_channel END AS source, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS daily_unique_visitors FROM page_views WHERE event_date >= ? AND is_internal = 0 GROUP BY source ORDER BY views DESC LIMIT 20",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT COUNT(*) AS requests FROM crawler_hits WHERE event_date >= ?",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT event_date AS date, COUNT(*) AS requests FROM crawler_hits WHERE event_date >= ? GROUP BY event_date ORDER BY event_date",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT crawler, COUNT(*) AS requests FROM crawler_hits WHERE event_date >= ? GROUP BY crawler ORDER BY requests DESC LIMIT 20",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT crawler, path, COUNT(*) AS requests FROM crawler_hits WHERE event_date >= ? GROUP BY crawler, path ORDER BY requests DESC LIMIT 30",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT event_type AS event, COUNT(*) AS events, COUNT(DISTINCT visitor_hash) AS daily_unique_users FROM interaction_events WHERE event_date >= ? AND is_internal = 0 GROUP BY event_type ORDER BY events DESC",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT event_type AS event, path, event_label AS label, COUNT(*) AS events FROM interaction_events WHERE event_date >= ? AND is_internal = 0 GROUP BY event_type, path, event_label ORDER BY events DESC LIMIT 50",
    ).bind(startDate),
    env.DB.prepare(
      "SELECT source_host AS host, COUNT(*) AS embeds FROM interaction_events WHERE event_date >= ? AND is_internal = 0 AND event_type = 'embed_view' AND source_host <> '' GROUP BY source_host ORDER BY embeds DESC LIMIT 20",
    ).bind(startDate),
  ]);

  return Response.json(
    {
      period: { days: 30, startDate, endDate: new Date().toISOString().slice(0, 10) },
      totals: totals.results[0] ?? { views: 0, daily_unique_visitors: 0 },
      internalTotals: internalTotals.results[0] ?? { views: 0, daily_unique_visitors: 0 },
      historicalUnclassifiedTotals: historicalTotals.results[0] ?? { views: 0, daily_unique_visitors: 0 },
      daily: daily.results,
      internalDaily: internalDaily.results,
      historicalUnclassifiedDaily: historicalDaily.results,
      topPages: topPages.results,
      topReferrers: topReferrers.results,
      sourceChannels: sourceChannels.results,
      crawlerTotals: crawlerTotals.results[0] ?? { requests: 0 },
      crawlerDaily: crawlerDaily.results,
      topCrawlers: topCrawlers.results,
      crawlerTopPages: crawlerTopPages.results,
      eventTotals: eventTotals.results,
      eventTopPages: eventTopPages.results,
      embedSources: embedSources.results,
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

    if ((request.method === "GET" || request.method === "HEAD") && env.DB) {
      const crawler = detectCrawler(request.headers.get("user-agent") ?? "");
      if (crawler) ctx.waitUntil(recordCrawlerHit(request, env, crawler));
    }

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
