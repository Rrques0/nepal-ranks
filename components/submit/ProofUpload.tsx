"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ProofUploadProps {
  onUploadComplete: (url: string) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export function ProofUpload({
  onUploadComplete,
  label = "Upload Proof",
  accept = "image/*",
  className,
}: ProofUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const supabase = createClient();
    const filename = `proofs/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { data, error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filename, file, { upsert: true });

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("proofs")
      .getPublicUrl(data.path);

    onUploadComplete(publicUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-white">{label}</label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-[#2A2A2A]">
          <img src={preview} alt="Proof" className="w-full max-h-48 object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2A2A2A] hover:border-[#DC143C]/50 bg-[#1E1E1E] p-8 cursor-pointer transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-8 w-8 rounded-full border-2 border-[#2A2A2A] border-t-[#DC143C]" />
              <p className="text-sm text-[#A0A0A0]">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DC143C]/10 mb-3">
                <ImageIcon className="h-6 w-6 text-[#DC143C]" />
              </div>
              <p className="text-sm text-white font-medium">Drop image here or click to upload</p>
              <p className="text-xs text-[#6B7280] mt-1">PNG, JPG, GIF up to 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
