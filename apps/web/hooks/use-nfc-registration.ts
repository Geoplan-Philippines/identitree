import { useState, useCallback } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";

export function useNfcRegistration() {
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [hardwareId, setHardwareId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const registerAndWrite = useCallback(async (encodedUrl: string) => {
    if (!("NDEFReader" in window)) {
      toast.error("Web NFC is not supported on this browser/device.");
      return;
    }

    try {
      setIsScanning(true);
      const ndef = new (window as any).NDEFReader();
      
      // Start scanning for the tap
      await ndef.scan();
      
      return new Promise<void>((resolve, reject) => {
        ndef.onreading = async (event: any) => {
          try {
            const serialNumber = event.serialNumber;
            setHardwareId(serialNumber);
            setIsScanning(false);
            setIsWriting(true);

            // 1. Link in backend
            await apiClient.post("/nfc-cards/public-link-hardware", {
              encodedUrl,
              hardwareId: serialNumber,
            });

            // 2. Write to card
            const urlWithRef = new URL(encodedUrl, window.location.origin);
            urlWithRef.searchParams.set("ref", "nfc_tap");
            
            await ndef.write({
              records: [{ recordType: "url", data: urlWithRef.toString() }]
            });

            // 3. Invalidate notifications and cards
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.refetchQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["nfc-cards"] });

            toast.success("Card linked and written successfully!");
            setIsWriting(false);
            resolve();
          } catch (error: any) {
            console.error("NFC Error:", error);
            toast.error(error.message || "Failed to complete registration");
            setIsWriting(false);
            setIsScanning(false);
            reject(error);
          }
        };

        ndef.onreadingerror = (error: any) => {
          toast.error("Cannot read NFC tag. Try another one?");
          setIsScanning(false);
          reject(error);
        };
      });

    } catch (error: any) {
      console.error("NFC Scan Error:", error);
      toast.error(error.message || "Failed to start NFC scanner");
      setIsScanning(false);
      throw error;
    }
  }, []);

  return {
    isScanning,
    isWriting,
    hardwareId,
    registerAndWrite,
  };
}
