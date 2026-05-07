import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/shared/header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";


const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://identitree.geoplanph.com"),
  title: {
    default: "Identitree — Premium NFC Digital Business Cards for Teams",
    template: "%s | Identitree",
  },

  description:
    "Manage digital business cards, contacts, teams, and analytics in one premium workspace.",
  keywords: ["NFC", "Digital Business Card", "Networking", "Identity", "Geoplan"],
  authors: [
    { name: "Geoplan Philippines Inc." },
    { name: "Chester Luke Maligaso" },
    { name: "Ace Pasiliao" },
  ],
  creator: "Identitree",
  publisher: "Identitree",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://identitree.geoplanph.com",
    siteName: "Identitree",
    title: "Identitree — NFC Digital Business Cards",
    description: "Manage digital business cards, contacts, teams, and analytics in one premium workspace.",
    images: [
      {
        url: "https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png",
        width: 1200,
        height: 630,
        alt: "Identitree",
      },
    ],
  },


  twitter: {
    card: "summary_large_image",
    title: "Identitree — NFC Digital Business Cards",
    description: "Manage digital business cards, contacts, teams, and analytics in one premium workspace.",
    images: ["https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png"],
    creator: "@geoplanph",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  icons: {
    icon: "https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png",
    shortcut: "https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png",
    apple: "https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#0f172a" />
      </head>


      <body className="antialiased bg-background text-foreground overflow-x-hidden">
        <TanstackQueryProvider>
          <Header />
          <Toaster position="top-right" closeButton richColors />
          {children}
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
