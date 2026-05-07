export type AnalyticsChannel = "QR_SCAN" | "NFC_TAP" | "DIRECT_LINK";

export function getAnalyticsChannel(): AnalyticsChannel {
  if (typeof window === "undefined") return "DIRECT_LINK";
  
  const search = window.location.search.toLowerCase();
  
  // Check for various ways the source might be indicated
  if (search.includes("qr") || search.includes("ref=qr")) return "QR_SCAN";
  if (search.includes("nfc") || search.includes("ref=nfc")) return "NFC_TAP";
  
  return "DIRECT_LINK";
}
