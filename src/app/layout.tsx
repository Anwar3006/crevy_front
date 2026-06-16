import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// import OfflineBanner from "@/components/offline/OfflineBanner";
// import SyncListener from "@/components/offline/SyncListener";
import QueryProvider from "@/components/providers/query-provider";
import SmoothScroll from "@/components/providers/SmoothScroll";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2cc295" },
    { media: "(prefers-color-scheme: dark)", color: "#131927" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Crevy — Carbon Registry",
  description:
    "Green project management and carbon credit marketplace for Africa and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        <QueryProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </QueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
