import "./globals.css";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";

const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
});

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
    <html lang="de" className={`${heading.variable} ${body.variable}`}>
      <body className="bg-[#fbf7ef] text-[#173f35] antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
