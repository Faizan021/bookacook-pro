// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google"; // Using a standard font
import { LogoMark } from "@/components/ui/logo-mark";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Speisely | Kulinarische Exzellenz",
  description: "Exklusive Catering-Plattform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {/* You can put a Global Header here if you want it on EVERY page */}
        {children}
      </body>
    </html>
  );
}
