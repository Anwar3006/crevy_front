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

// Controls the mobile browser chrome colour (address bar / status bar)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2cc295" },
    { media: "(prefers-color-scheme: dark)", color: "#131927" },
  ],
  width: "device-width",
  initialScale: 1,
  // Removed: maximumScale: 1
};

export const metadata: Metadata = {
  title: "Crevy — Carbon Registry",
  description:
    "Green project management and carbon credit marketplace for Africa and beyond.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crevy",
  },
  icons: {
    icon: [
      { url: "/icons/pwa/icon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/icons/pwa/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: "/icons/pwa/icon-180x180.png",
    other: [
      { rel: "mask-icon", url: "/icons/logo_white.png", color: "#2cc295" },
    ],
  },
  other: {
    // Android / Chrome — enables "Add to Home Screen" banner
    "mobile-web-app-capable": "yes",
  },
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
          <SmoothScroll>
            {/* Shows when device loses network — sticks to the top of screen */}
            {/* <OfflineBanner /> */}
            {/* Listens for DRAIN_QUEUE messages posted by the service worker */}
            {/* <SyncListener /> */}
            {children}
          </SmoothScroll>
        </QueryProvider>
        <Toaster position="top-right" richColors />

        {/*
          Service worker registration.
          Uses dangerouslySetInnerHTML because next/script "beforeInteractive"
          does not fire reliably on all browsers for SW registration.
          This is safe — it is static, contains no user input.
        */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static SW registration
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker
                    .register('/sw.js', { scope: '/' })
                    .then(function (reg) {
                      console.log('[Crevy SW] Registered. Scope:', reg.scope);
                    })
                    .catch(function (err) {
                      console.warn('[Crevy SW] Registration failed:', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
