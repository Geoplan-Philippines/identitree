"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/png", "image/jpeg"];
const ACCEPTED_HUMAN = "PNG, JPG up to 5MB";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type LogoDropzoneProps = {
  /** Currently selected file (controlled by parent). */
  value: File | null;
  /** Fires when a valid file is dropped/selected or when the file is removed. */
  onChange: (file: File | null) => void;
  /** Optional id for the input — useful when paired with a Field/Label. */
  id?: string;
  disabled?: boolean;
};

export function LogoDropzone({
  value,
  onChange,
  id = "logo-upload",
  disabled,
}: LogoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setFile = useCallback(
    (file: File | null) => {
      setError(null);

      if (!file) {
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        onChange(null);
        return;
      }

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Unsupported file. Use PNG or JPG.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("File is too large. Max size is 5MB.");
        return;
      }

      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      onChange(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = event.dataTransfer.files?.[0];
      if (file) setFile(file);
    },
    [disabled, setFile],
  );

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  if (value && previewUrl) {
    const sizeKb = (value.size / 1024).toFixed(0);
    return (
      <div className="flex items-center gap-3 border border-input bg-muted/30 p-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden border border-input bg-background">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Logo preview"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">
            {value.name}
          </p>
          <p className="text-[12px] text-muted-foreground">{sizeKb} KB</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            className="text-[12px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:pointer-events-none disabled:opacity-50"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => setFile(null)}
            disabled={disabled}
            aria-label="Remove logo"
            className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-describedby={error ? `${id}-error` : undefined}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPicker();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-input bg-muted/30 px-4 py-6 text-center outline-none transition-colors",
        "hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        isDragging && "border-foreground/40 bg-muted/70",
        disabled && "pointer-events-none opacity-50",
        error && "border-destructive/60 bg-destructive/5",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-9 w-9 items-center justify-center border border-input bg-background text-muted-foreground transition-colors",
          isDragging && "border-foreground/30 text-foreground",
        )}
      >
        {isDragging ? (
          <UploadCloud className="h-4 w-4" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </span>
      <div className="space-y-0.5">
        <p className="text-[13px] font-medium text-foreground">
          Upload your company logo
        </p>
        <p className="text-[12px] text-muted-foreground">
          Drag &amp; drop or{" "}
          <span className="text-foreground underline underline-offset-4">
            browse
          </span>
        </p>
        <p className="pt-1 text-[11px] text-muted-foreground">{ACCEPTED_HUMAN}</p>
      </div>
      {error && (
        <p id={`${id}-error`} className="pt-1 text-[12px] text-destructive">
          {error}
        </p>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        disabled={disabled}
      />
    </div>
  );
}
