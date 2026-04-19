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
      {/* We set the background here so the whole site is dark by default */}
      <body className={`${inter.className} bg-[#192b1a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
