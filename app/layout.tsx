import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tawakkul Zone",
  description: "Premium Islamic Fashion & Clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
  <WishlistProvider>
    <Header />

    <main className="flex-1">
      {children}
    </main>
  </WishlistProvider>
</CartProvider>
      </body>
    </html>
  );
}