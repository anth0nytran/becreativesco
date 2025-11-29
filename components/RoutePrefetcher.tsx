"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROUTES_TO_PREFETCH = ["/", "/portfolio", "/contact"];

const supportsIdleCallback = () =>
  typeof window !== "undefined" && "requestIdleCallback" in window;

export default function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    if (!router) return;

    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    const runPrefetch = () => {
      ROUTES_TO_PREFETCH.forEach((route) => {
        try {
          router.prefetch(route);
        } catch {
          // ignore failures (e.g., route already cached)
        }
      });
    };

    if (supportsIdleCallback()) {
      idleHandle = (window as Window & typeof globalThis).requestIdleCallback(
        runPrefetch,
        { timeout: 2000 },
      );
    } else {
      timeoutHandle = window.setTimeout(runPrefetch, 1000);
    }

    return () => {
      if (idleHandle && "cancelIdleCallback" in window) {
        (window as Window & typeof globalThis).cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [router]);

  return null;
}

