// src/lib/offline/db.ts
//
// Single IndexedDB database for all offline Crevy data.
// Uses the `idb` package for Promise-based, fully typed access.
//
// Stores:
//   drafts            — auto-saved in-progress form data
//   submission-queue  — API mutations queued while offline
//   document-queue    — file blobs (as base64) queued for upload
//   offline-cache     — last-fetched list data for read-only offline views

import { type DBSchema, type IDBPDatabase, openDB } from "idb";

// ─── Type definitions ─────────────────────────────────────────────────────────

export interface DraftRecord {
  /** Stable key — e.g. "project-owner-draft" | "project-draft" */
  id: string;
  type: "project-owner" | "project";
  /** Which form step the user was on when the draft was saved */
  step: number;
  /** The raw form values — serialised as a plain object (no File objects) */
  data: unknown;
  savedAt: number; // Date.now()
}

export interface QueuedSubmission {
  id: string;
  type: "create-project-owner" | "create-project" | "upload-document";
  url: string;
  method: "POST" | "PUT" | "PATCH";
  /** Serialisable body — File objects are stored separately in document-queue */
  body: unknown;
  headers?: Record<string, string>;
  queuedAt: number;
  attempts: number;
  lastAttempt: number | null;
  error: string | null;
}

export interface QueuedDocument {
  id: string;
  /** Links this document to the in-progress project draft */
  projectTempId: string;
  documentType: string;
  fileName: string;
  mimeType: string;
  /** File content encoded as base64 — NOT the data: URI prefix */
  base64: string;
  fileSize: number;
  queuedAt: number;
}

export interface OfflineCacheRecord {
  id: string;
  type: "project-owner-list" | "project-list" | "currencies";
  data: unknown;
  cachedAt: number;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

interface CrevyDB extends DBSchema {
  drafts: {
    key: string;
    value: DraftRecord;
    indexes: { "by-type": string };
  };
  "submission-queue": {
    key: string;
    value: QueuedSubmission;
    indexes: { "by-type": string; "by-queued-at": number };
  };
  "document-queue": {
    key: string;
    value: QueuedDocument;
    indexes: { "by-project": string };
  };
  "offline-cache": {
    key: string;
    value: OfflineCacheRecord;
    indexes: { "by-type": string };
  };
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _db: IDBPDatabase<CrevyDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<CrevyDB>> {
  if (_db) return _db;

  _db = await openDB<CrevyDB>("crevy-offline-v1", 1, {
    upgrade(db) {
      const drafts = db.createObjectStore("drafts", { keyPath: "id" });
      drafts.createIndex("by-type", "type");

      const queue = db.createObjectStore("submission-queue", { keyPath: "id" });
      queue.createIndex("by-type", "type");
      queue.createIndex("by-queued-at", "queuedAt");

      const docs = db.createObjectStore("document-queue", { keyPath: "id" });
      docs.createIndex("by-project", "projectTempId");

      const cache = db.createObjectStore("offline-cache", { keyPath: "id" });
      cache.createIndex("by-type", "type");
    },
  });

  return _db;
}

// ─── Draft helpers ────────────────────────────────────────────────────────────

export async function saveDraft(draft: DraftRecord): Promise<void> {
  const db = await getDB();
  await db.put("drafts", { ...draft, savedAt: Date.now() });
}

export async function loadDraft(id: string): Promise<DraftRecord | undefined> {
  const db = await getDB();
  return db.get("drafts", id);
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("drafts", id);
}

export async function listDrafts(
  type: DraftRecord["type"],
): Promise<DraftRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex("drafts", "by-type", type);
}

// ─── Submission queue helpers ─────────────────────────────────────────────────

export async function enqueueSubmission(
  item: Omit<QueuedSubmission, "attempts" | "lastAttempt" | "error">,
): Promise<void> {
  const db = await getDB();
  await db.put("submission-queue", {
    ...item,
    attempts: 0,
    lastAttempt: null,
    error: null,
  });
}

export async function listQueue(): Promise<QueuedSubmission[]> {
  const db = await getDB();
  // Sort by insertion time so oldest items are retried first
  return db.getAllFromIndex("submission-queue", "by-queued-at");
}

export async function getQueueCount(): Promise<number> {
  const db = await getDB();
  return db.count("submission-queue");
}

export async function updateQueueItem(
  id: string,
  updates: Partial<QueuedSubmission>,
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("submission-queue", id);
  if (existing) await db.put("submission-queue", { ...existing, ...updates });
}

export async function removeFromQueue(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("submission-queue", id);
}

// ─── Document queue helpers ───────────────────────────────────────────────────

export async function enqueueDocument(doc: QueuedDocument): Promise<void> {
  const db = await getDB();
  await db.put("document-queue", doc);
}

export async function getDocumentsByProject(
  projectTempId: string,
): Promise<QueuedDocument[]> {
  const db = await getDB();
  return db.getAllFromIndex("document-queue", "by-project", projectTempId);
}

export async function removeDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("document-queue", id);
}

// ─── Offline cache helpers ────────────────────────────────────────────────────

export async function setCachedData(
  id: string,
  type: OfflineCacheRecord["type"],
  data: unknown,
): Promise<void> {
  const db = await getDB();
  await db.put("offline-cache", { id, type, data, cachedAt: Date.now() });
}

export async function getCachedData(
  id: string,
): Promise<OfflineCacheRecord | undefined> {
  const db = await getDB();
  return db.get("offline-cache", id);
}

export async function clearCachedData(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("offline-cache", id);
}
