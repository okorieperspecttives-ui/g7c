import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Alternative Energy Marketplace | Inverters, Batteries & Solar Solutions",
    template: "%s | Global 7CS Energy Marketplace",
  },
  description: "Shop reliable inverters, solar batteries, portable power stations and clean energy products with flexible payment options across Nigeria.",
  keywords: ["energy marketplace", "solar panels nigeria", "inverters lagos", "lithium batteries", "power backup solutions"],
  authors: [{ name: "Global 7CS" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://global7cs.energy",
    siteName: "Global 7CS",
    title: "Alternative Energy Marketplace | Inverters, Batteries & Solar Solutions",
    description: "Shop reliable inverters, solar batteries, portable power stations and clean energy products with flexible payment options across Nigeria.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global 7CS Energy Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alternative Energy Marketplace | Inverters, Batteries & Solar Solutions",
    description: "Shop reliable inverters, solar batteries, portable power stations and clean energy products with flexible payment options across Nigeria.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <WhatsAppButton />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
