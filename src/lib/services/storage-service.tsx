import axios from "axios";
import { axiosClient } from "../axiosClient";

/**
 * StorageService handles file uploads to S3-compatible object stores (e.g., Cloudflare R2).
 * It relies on backend endpoints to generate presigned URLs for secure uploads.
 */
export const StorageService = {
  /**
   * Request a presigned URL from the backend and upload the file directly to the object store.
   * @param file The file to upload
   * @param path The destination path (e.g., "project_doc/ABC-123/")
   * @returns The relative path of the uploaded object
   */
  uploadFile: async (file: File, path: string): Promise<string> => {
    // 1. Get presigned URL from backend with metadata
    // We send metadata so the backend can validate and generate a secure key
    const extension = file.name.split(".").pop() || "";

    const { data: presignedRes } = await axiosClient.post(
      "/storage/presigned-url",
      {
        extension,
        size: file.size,
        type: file.type,
        path: path,
      },
    );

    const { uploadUrl, objectKey } = presignedRes.data;

    // 2. Upload file to the presigned URL
    // NOTE: We don't use axiosClient here.
    // We also OMIT the Content-Type header because it was not signed by the backend.
    // If we send it, the storage provider will reject the request with a signature mismatch (403).
    await axios.put(uploadUrl, file);

    return objectKey;
  },
  /**
   * Resolves a full URL for a given object key or array of keys.
   * @param keys A single key or an array of keys
   * @returns The full public URL(s)
   */
  resolveUrl: (keys: string | string[]): string | string[] => {
    const publicUrlBase = process.env.NEXT_PUBLIC_STORAGE_URL || "";
    const cleanBase = publicUrlBase.replace(/\/$/, "");

    const resolveSingle = (key: string) => {
      if (!key) return "";
      // If it's already a full URL, return it as is
      if (key.startsWith("http://") || key.startsWith("https://")) {
        return key;
      }
      return `${cleanBase}/${key.replace(/^\//, "")}`;
    };

    if (Array.isArray(keys)) {
      return keys.map(resolveSingle);
    }

    return resolveSingle(keys);
  },
};
