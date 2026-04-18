import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This fixes the "zoom" issue on mobile devices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Speisely",
    template: "%s | Speisely",
  },
  description:
    "Speisely is a premium AI-assisted catering marketplace in Germany for weddings, corporate events, private gatherings, and curated caterer discovery.",
  applicationName: "Speisely",
  keywords: [
    "catering marketplace Germany",
    "premium caterers Berlin",
    "event catering Germany",
    "wedding catering Berlin",
    "corporate catering Germany",
    "AI catering marketplace",
    "Speisely",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            {/* 
               FIX: The wrapper below prevents the "zoomed out" look. 
               It centers the content and limits the width to 1280px (max-w-7xl).
            */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
