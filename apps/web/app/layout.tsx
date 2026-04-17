import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/shared/header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Identitree — NFC Digital Business Cards",
  description:
    "Manage digital business cards, contacts, teams, and analytics in one premium workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-foreground overflow-x-hidden">
        <AuthProvider>
          <Header />
          <Toaster position="top-right" closeButton richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
