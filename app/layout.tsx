import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tawakkulzone.shop"),

  title: {
    default: "Tawakkul Zone | Premium Islamic Fashion",
    template: "%s | Tawakkul Zone",
  },

  description:
    "Shop premium Three Piece, Abaya, Hijab and Islamic fashion online in Bangladesh. Cash on Delivery available nationwide.",

  keywords: [
    "Tawakkul Zone",
    "Three Piece",
    "Islamic Fashion",
    "Abaya",
    "Hijab",
    "Women's Clothing",
    "Bangladesh Online Shop",
    "Three Piece BD",
    "Modest Fashion",
  ],

  authors: [{ name: "Tawakkul Zone" }],
  creator: "Tawakkul Zone",
  publisher: "Tawakkul Zone",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Tawakkul Zone",
    description:
      "Premium Islamic Fashion & Clothing in Bangladesh.",
    url: "https://tawakkulzone.shop",
    siteName: "Tawakkul Zone",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Tawakkul Zone",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tawakkul Zone",
    description:
      "Premium Islamic Fashion & Clothing",
    images: ["/icon.png"],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
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