"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        // Precachear lo que ya se descargó antes de que el SW tomara el control.
        const urls = performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter((u) => u.startsWith(location.origin));
        reg.active?.postMessage({ type: "CACHE_URLS", urls: [location.href, ...urls] });
      })
      .catch(() => {});
  }, []);
  return null;
}
