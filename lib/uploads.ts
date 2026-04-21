import { randomUUID } from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function sanitizeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/-+/g, "-");
}

function getSupabaseStorageConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "zenmora-uploads";

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for file uploads.");
  }

  return { url, serviceRoleKey, bucket };
}

export async function saveUploadedFile(file: File | null, directory: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const { url, serviceRoleKey, bucket } = getSupabaseStorageConfig();
  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const safeName = sanitizeFileName(file.name || "upload");
  const finalName = `${randomUUID()}-${safeName}`;
  const objectPath = path.posix.join(directory, finalName);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: false
  });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(bucket).getPublicUrl(objectPath);

  return {
    fileName: safeName,
    relativePath: publicUrl
  };
}
