"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const INTERNAL_TRAFFIC_STORAGE_KEY = "freightkit-internal-traffic";

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/internal-traffic" || navigator.doNotTrack === "1") return;

    let isInternal = false;
    try {
      isInternal = window.localStorage.getItem(INTERNAL_TRAFFIC_STORAGE_KEY) === "1";
    } catch {
      // Analytics remains available when storage is disabled by the browser.
    }

    const search = new URLSearchParams(window.location.search);
    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer,
      isInternal,
      utmSource: search.get("utm_source") ?? "",
      utmMedium: search.get("utm_medium") ?? "",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      return;
    }

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
