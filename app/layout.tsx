import type { Metadata } from "next";
import { Caveat, DM_Sans, DM_Serif_Display } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyOrder } from "@/components/sticky-order";
import { getHotplateUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const dynamic = "force-dynamic";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap"
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap"
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Small-batch sourdough bakery`,
    template: `%s | ${siteConfig.shortName}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Fresh artisan sourdough loaf"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.svg"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const hotplateUrl = getHotplateUrl();

  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased">
        <SiteHeader hotplateUrl={hotplateUrl} />
        <main>{children}</main>
        <SiteFooter />
        <StickyOrder hotplateUrl={hotplateUrl} />
      </body>
    </html>
  );
}
