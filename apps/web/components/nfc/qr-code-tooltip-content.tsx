"use client";

import { useEffect, useState } from "react";
import { generateQrCodeDataUrl } from "@/lib/utils/qr-code";
import { Skeleton } from "@/components/ui/skeleton";
import { DownloadIcon } from "lucide-react";

interface QrCodeTooltipContentProps {
  url: string;
}

export function QrCodeTooltipContent({ url }: QrCodeTooltipContentProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    try {
      const qrUrl = new URL(url);
      qrUrl.searchParams.set("ref", "qr");
      generateQrCodeDataUrl(qrUrl.toString())
        .then((res) => {
          if (active) setImgSrc(res);
        })
        .catch(console.error);
    } catch (e) {
      console.error("Invalid URL", e);
    }
    return () => {
      active = false;
    };
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-2 p-1">
      {imgSrc ? (
        <img src={imgSrc} alt="QR Code Preview" className="w-32 h-32 object-contain bg-white rounded-sm p-1" />
      ) : (
        <Skeleton className="w-32 h-32 rounded-sm" />
      )}
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
        <DownloadIcon size={12} />
        <span>Click to download</span>
      </div>
    </div>
  );
}
