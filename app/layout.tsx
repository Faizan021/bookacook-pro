// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Speisely | Premium Catering",
  description: "Find the perfect caterer for your next event.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-[#192b1a] text-white antialiased`}>
        {/* This wraps every page in your website */}
        {children}
      </body>
    </html>
  );
}
