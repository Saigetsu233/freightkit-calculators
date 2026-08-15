"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const INTERNAL_TRAFFIC_STORAGE_KEY = "freightkit-internal-traffic";

function isInternalBrowser() {
  try {
    return window.localStorage.getItem(INTERNAL_TRAFFIC_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
}

export function trackAnalyticsEvent(eventType: "tool_open" | "calculator_visible" | "input_started" | "valid_result_generated" | "result_viewed" | "calculation_completed" | "copy_result" | "guide_to_tool" | "embed_view" | "decision_card_copy" | "share_link_copy", eventLabel = "", sourceHost = "") {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  send({ path: window.location.pathname, isInternal: isInternalBrowser(), eventType, eventLabel, sourceHost });
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/internal-traffic" || navigator.doNotTrack === "1") return;

    const isInternal = isInternalBrowser();

    const search = new URLSearchParams(window.location.search);
    const payload = {
      path: pathname,
      referrer: document.referrer,
      isInternal,
      utmSource: search.get("utm_source") ?? "",
      utmMedium: search.get("utm_medium") ?? "",
    };
    send(payload);

    if (pathname.startsWith("/embed/")) {
      trackAnalyticsEvent("embed_view", pathname.replace("/embed/", ""), document.referrer);
      return;
    }
    if (pathname.startsWith("/tools/")) {
      trackAnalyticsEvent("tool_open", pathname.replace("/tools/", ""));
      return;
    }
    if (pathname.startsWith("/guides/")) {
      const recordGuideExit = (event: MouseEvent) => {
        const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="/tools/"]') : null;
        if (anchor) trackAnalyticsEvent("guide_to_tool", anchor.getAttribute("href") ?? "");
      };
      document.addEventListener("click", recordGuideExit);
      return () => document.removeEventListener("click", recordGuideExit);
    }
  }, [pathname]);

  return null;
}
