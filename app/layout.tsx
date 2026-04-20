import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Speisely",
  description: "Natürlichsprachige Hospitality Intelligence für Premium Catering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-[#192b1a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
