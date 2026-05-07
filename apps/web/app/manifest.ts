import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Identitree",
    short_name: "Identitree",
    description: "Manage digital business cards, contacts, teams, and analytics in one premium workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: "https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png",
        sizes: "any",
        type: "image/png",
      },
    ],

  };
}
