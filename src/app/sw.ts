// src/app/sw.ts
// Compiled by Serwist at build time → public/sw.js
// Do NOT import this file from the app — it is loaded by the browser directly.

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,

  runtimeCaching: [
    // ── Next.js static chunks: Cache First (immutable hashed filenames) ──────
    {
      matcher: /^\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },

    // ── Next.js image optimisation: Cache First ───────────────────────────────
    {
      matcher: /^\/_next\/image.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },

    // ── Google Fonts: Stale While Revalidate ─────────────────────────────────
    {
      matcher: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },

    // ── Cloudinary assets: Stale While Revalidate ────────────────────────────
    {
      matcher: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "cloudinary",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },

    // ── API GET reads: Network First → stale fallback ────────────────────────
    // POST/PATCH/DELETE are NOT cached — they go through the submission queue
    // in IndexedDB (useSubmissionQueue hook) and never hit the SW cache layer.
    {
      matcher: ({ request, url }) =>
        request.method === "GET" &&
        (url.pathname.startsWith("/api/v2/project-owners") ||
          url.pathname.startsWith("/api/v2/projects") ||
          url.pathname.startsWith("/api/v2/partners") ||
          url.pathname.startsWith("/api/v2/auth/currencies") ||
          url.pathname.startsWith("/api/v2/mrv")),
      handler: "NetworkFirst",
      options: {
        cacheName: "api-reads",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // ── Navigation (HTML pages): Network First → cached shell ─────────────────
    // Allows field agents to open /dashboard, /project-owners, /new-project
    // while offline and see their last-viewed state.
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },

    // ── Default cache strategies from @serwist/next ───────────────────────────
    ...defaultCache,
  ],
});

serwist.addEventListeners();

// ─── BACKGROUND SYNC ──────────────────────────────────────────────────────────
// When connectivity is restored after an offline submission, the browser fires
// a 'sync' event. We message the active window client(s) to drain the queue —
// keeping the API call logic in the app layer where auth cookies are available.
//
// Supported: Chrome/Android, Chromium-based browsers.
// Fallback: the useOnlineStatus hook fires drainSubmissionQueue() on 'online'.

self.addEventListener("sync", (event: Event) => {
  const syncEvent = event as any;
  if (syncEvent.tag === "crevy-sync-queue") {
    syncEvent.waitUntil(notifyClientsToSync());
  }
});

async function notifyClientsToSync(): Promise<void> {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  for (const client of clients) {
    client.postMessage({ type: "DRAIN_QUEUE" });
  }
}
