import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NOVA Northern Virginia Native Plants | Native Plant Database",
  description: "Comprehensive database of native plants for Northern Virginia gardens. Discover wildlife-friendly plants, bloom times, growing conditions, and gardening tips for sustainable landscaping.",
  keywords: ["native plants", "Northern Virginia", "NOVA", "gardening", "wildlife plants", "sustainable landscaping", "native garden", "Virginia plants"],
  authors: [{ name: "Margaret's Native Plant Database" }],
  creator: "Margaret",
  publisher: "NOVA Native Plants",
  openGraph: {
    title: "NOVA Northern Virginia Native Plants",
    description: "Discover native plants perfect for Northern Virginia gardens. Complete with growing guides and wildlife benefits.",
    url: "https://margaret-flower-app.vercel.app",
    siteName: "NOVA Native Plants",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVA Northern Virginia Native Plants",
    description: "Discover native plants perfect for Northern Virginia gardens",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://margaret-flower-app.vercel.app",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/android-chrome-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/android-chrome-512x512.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
