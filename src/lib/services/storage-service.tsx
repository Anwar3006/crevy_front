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
    const fileName = file.name;
    const objectKey = `${path}${Date.now()}-${fileName}`.replace(/\/\//g, "/");

    // 1. Get presigned URL from backend
    // Expected backend endpoint: POST /storage/presigned-url { key, contentType }
    const { data: presignedRes } = await axiosClient.post("/storage/presigned-url", {
      key: objectKey,
      contentType: file.type,
    });

    const { uploadUrl } = presignedRes.data;

    // 2. Upload file to the presigned URL
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

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

    if (Array.isArray(keys)) {
      return keys.map(key => `${cleanBase}/${key.replace(/^\//, "")}`);
    }

    return `${cleanBase}/${keys.replace(/^\//, "")}`;
  }
};
