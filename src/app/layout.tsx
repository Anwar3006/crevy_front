import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/query-provider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/context/TransitionContext";

const montserratFont = localFont({
  src: "../../public/fonts/Montserrat-VariableFont_wght.ttf",
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
      <body className={`${montserratFont.className} antialiased`}>
        <QueryProvider>
          <TransitionProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </TransitionProvider>
        </QueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
