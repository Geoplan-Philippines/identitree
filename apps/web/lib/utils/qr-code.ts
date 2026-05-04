import QRCode from "qrcode";

export const generateQrCodeDataUrl = async (url: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(url, {
      width: 500,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Failed to generate QR code", err);
    throw err;
  }
};

export const downloadQrCode = async (url: string, filename: string = "qrcode.png") => {
  try {
    const dataUrl = await generateQrCodeDataUrl(url);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Failed to download QR code", err);
  }
};
