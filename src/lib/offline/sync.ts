// src/lib/offline/sync.ts
//
// Drains the IndexedDB submission queue when the device is online.
//
// Called by three paths:
//   1. SyncListener component — receives DRAIN_QUEUE from the service worker
//   2. useOnlineStatus hook   — fires on the 'online' browser event
//   3. useSubmissionQueue     — drains on mount if navigator.onLine is true

import { axiosClient } from "@/lib/axiosClient";
import {
  listQueue,
  type QueuedSubmission,
  removeFromQueue,
  updateQueueItem,
} from "./db";

const MAX_ATTEMPTS = 5;

// Exponential back-off delays in milliseconds — NOT enforced here because
// the queue may be drained at any time. `attempts` is stored so callers
// can decide whether to surface an item as permanently failed.
const _BACKOFF = [1_000, 5_000, 15_000, 60_000, 300_000]; // unused but kept for reference

export type DrainResult = {
  succeeded: number;
  failed: number;
  remaining: number;
};

export type ItemCallback = (
  item: QueuedSubmission,
  status: "success" | "failed" | "network-error",
) => void;

/**
 * Attempt to submit every item in the queue in insertion order.
 *
 * On success:  item is removed from the queue.
 * On 4xx:      item is updated with the error and incremented attempt count.
 *              If attempts >= MAX_ATTEMPTS it is left in the queue and marked
 *              permanently failed (the UI surfaces this to the user).
 * On network:  stops draining immediately — device is still offline.
 */
export async function drainSubmissionQueue(
  onItem?: ItemCallback,
): Promise<DrainResult> {
  const queue = await listQueue();
  let succeeded = 0;
  let failed = 0;

  for (const item of queue) {
    // Skip permanently failed items — user must manually retry
    if (item.attempts >= MAX_ATTEMPTS) {
      failed++;
      onItem?.(item, "failed");
      continue;
    }

    try {
      await axiosClient.request({
        url: item.url,
        method: item.method,
        data: item.body,
        headers: {
          "Content-Type": "application/json",
          // Lets the backend log offline syncs differently if desired
          "X-Offline-Sync": "true",
          ...item.headers,
        },
      });

      await removeFromQueue(item.id);
      succeeded++;
      onItem?.(item, "success");
    } catch (err: unknown) {
      const axiosErr = err as any;
      const isNetwork = !axiosErr?.response;

      await updateQueueItem(item.id, {
        attempts: item.attempts + 1,
        lastAttempt: Date.now(),
        error: isNetwork
          ? "Network unavailable"
          : (axiosErr?.response?.data?.message ??
            axiosErr?.message ??
            "Unknown error"),
      });

      if (isNetwork) {
        // Still offline — abort the rest of the drain
        onItem?.(item, "network-error");
        break;
      }

      // Server error (4xx/5xx) — mark failed but keep draining other items
      if (item.attempts + 1 >= MAX_ATTEMPTS) {
        failed++;
        onItem?.(item, "failed");
      }
    }
  }

  const remaining = (await listQueue()).length;
  return { succeeded, failed, remaining };
}

// ─── Background Sync registration ────────────────────────────────────────────

/**
 * Tell the service worker to fire a 'sync' event when connectivity returns.
 * Silently no-ops on browsers that don't support the Background Sync API
 * (Firefox, iOS <16.4) — the 'online' event fallback handles those.
 */
export async function requestBackgroundSync(): Promise<void> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("SyncManager" in window)
  ) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register("crevy-sync-queue");
  } catch {
    // SW may not be active yet on first visit — the online event fallback
    // in useOnlineStatus will handle it
  }
}
