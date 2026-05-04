
import { redirect } from "next/navigation";
import { ClaimClient } from "@/components/nfc/claim-client";
import { createApiUrl } from "@/lib/api/config";

interface ClaimPageProps {
  searchParams: Promise<{ id?: string; uid?: string }>;
}

export default async function ClaimPage({ searchParams }: ClaimPageProps) {
  const params = await searchParams;
  const hardwareId = params.id || params.uid;

  if (hardwareId) {
    try {
      // Server-side check for faster redirection
      const res = await fetch(createApiUrl(`/nfc-cards/public-check/${hardwareId}`), {
        next: { revalidate: 0 } // Don't cache the check
      });
      
      if (res.ok) {
        const status = await res.json();
        if (status.isAssigned && status.encodedUrl) {
          // Instant server-side redirect
          return redirect(status.encodedUrl);
        }
      }
    } catch (err) {
      console.error("Server-side status check failed:", err);
      // Fallback to client-side logic if fetch fails
    }
  }

  return <ClaimClient initialHardwareId={hardwareId} />;
}
