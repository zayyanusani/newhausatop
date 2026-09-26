"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = { inputName: string };

export default function ImageUpload({ inputName }: Props) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Ana karbar JPG, PNG ko WebP kawai.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Hoton ya wuce 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `news/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("news-images").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An samu matsala wajen upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="uploadBox">
      <label>Hoton labari</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <input type="hidden" name={inputName} value={url} readOnly />
      {uploading && <small>Ana tura hoto...</small>}
      {url && <small className="uploadSuccess">✓ An shirya hoton</small>}
      {error && <small className="uploadError">{error}</small>}
    </div>
  );
}
