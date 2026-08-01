import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PWARegister from "@/components/PWARegister";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "AI Tracker — 90 Day Challenge",
  description:
    "Track habits, books, DSA and LeetCode across a 90-day challenge. Offline-first, installable PWA.",
  manifest: "/manifest.webmanifest",
  applicationName: "AI Tracker",
  appleWebApp: {
    capable: true,
    title: "AI Tracker",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    // required for standalone mode on iOS versions before 16.4
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#060914",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <PWARegister />
          <Navbar />
          <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:px-6 md:pb-16 md:pt-8">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
