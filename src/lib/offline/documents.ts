// src/lib/offline/documents.ts
//
// Converts File objects to base64 and stores them in IndexedDB so that
// field agents can capture documents / photos while offline. When
// connectivity returns, the sync layer uploads them via the normal API.

import { enqueueDocument, type QueuedDocument } from "./db";

/**
 * Reads a File as a base64-encoded string (without the data: URI prefix).
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:mime/type;base64," prefix — we only store the raw bytes
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () =>
      reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a QueuedDocument back to a File object so it can be submitted
 * to the upload API when the device comes back online.
 */
export function base64ToFile(doc: QueuedDocument): File {
  const byteString = atob(doc.base64);
  const bytes = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }

  return new File([bytes], doc.fileName, { type: doc.mimeType });
}

/**
 * Saves a document file to the offline queue.
 *
 * @param file          The File or Blob to store
 * @param documentType  One of the DOCUMENT_TYPES ids (e.g. "land_ownership")
 * @param projectTempId A stable identifier for the in-progress project draft.
 *                      Use the draft's form `id` field or "current-draft" as default.
 * @returns             The generated document ID — store this in form state
 *                      so the submit handler can find it.
 */
export async function saveDocumentOffline(
  file: File,
  documentType: string,
  projectTempId: string,
): Promise<string> {
  const base64 = await fileToBase64(file);
  // crypto.randomUUID() is available in all modern browsers and in Node 15+
  const id = `doc-${crypto.randomUUID()}`;

  const record: QueuedDocument = {
    id,
    projectTempId,
    documentType,
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
    base64,
    queuedAt: Date.now(),
  };

  await enqueueDocument(record);
  return id;
}

/**
 * Estimates the storage size of a base64 string in bytes.
 * Used to warn the user before storing very large files (e.g. videos).
 */
export function estimateBase64Size(base64: string): number {
  // base64 expands by ~33% vs raw bytes
  return Math.ceil((base64.length * 3) / 4);
}
