"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  /** Current image URL or object URL for preview */
  value?: string | null;
  /** Called when the user picks a new file */
  onChange: (file: File) => void;
  /** Label shown next to the image box (defaults to "Update Image") */
  label?: string;
  /** Description shown below the label */
  description?: string;
  /** Shape of the preview box ("square" | "circle"), defaults to "square" */
  shape?: "square" | "circle";
  /** Extra class names for the outer container */
  className?: string;
  /** Whether the upload is disabled (e.g. while saving) */
  disabled?: boolean;
  /** Unique id for the hidden file input (must be unique if multiple on page) */
  inputId?: string;
};

export function ImageUpload({
  value,
  onChange,
  label = "Update Image",
  description = "Recommended size: 512×512px. JPG, PNG or SVG.",
  shape = "square",
  className,
  disabled = false,
  inputId = "image-upload",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      // Reset so the same file can be re-selected
      e.target.value = "";
    }
  };

  const triggerInput = () => {
    if (!disabled) inputRef.current?.click();
  };

  const isCircle = shape === "circle";

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-6", className)}>
      {/* Preview box */}
      <div className="relative group shrink-0">
        <div
          className={cn(
            "size-20 overflow-hidden border border-border bg-muted flex items-center justify-center",
            isCircle ? "rounded-full" : "rounded-xl"
          )}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="size-full object-cover"
            />
          ) : (
            <Upload className="size-6 text-muted-foreground/40" />
          )}
        </div>

        {/* Hover overlay */}
        <label
          htmlFor={inputId}
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase text-white",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            isCircle ? "rounded-full" : "rounded-xl"
          )}
        >
          Change
        </label>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      {/* Info + button */}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={triggerInput}
          disabled={disabled}
        >
          Upload Image
        </Button>
      </div>
    </div>
  );
}
