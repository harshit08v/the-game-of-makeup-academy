import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AcademyProvider } from "@/lib/store";
import { NotificationToast } from "@/components/common/NotificationToast";
import { ReceiptModal } from "@/components/common/ReceiptModal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THE GAME OF MAKEUP — Academy Management Suite",
  description:
    "Premium SaaS Academy Management System for The Game of Makeup professional artistry academy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FAF8F5] text-charcoal-900 font-sans antialiased selection:bg-champagne-200 selection:text-charcoal-900">
        <AcademyProvider>
          {children}
          <ReceiptModal />
          <NotificationToast />
        </AcademyProvider>
      </body>
    </html>
  );
}
