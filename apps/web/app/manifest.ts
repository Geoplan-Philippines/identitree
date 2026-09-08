import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Handshakes",
    short_name: "Handshakes",
    description: "Manage digital business cards, contacts, teams, and analytics in one premium workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EC",
    theme_color: "#0D2A1F",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
