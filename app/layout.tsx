import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScrollHandler from "./components/SmoothScrollHandler";
import LeadModal from "./components/home/LeadModal";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Green Oasis",
  description: "Green Oasis",
  icons: {
    icon: "/images/metaicon.png",
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
      className={cn("font-sans scroll-smooth", "font-sans", geist.variable)}
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-523JV35W"
        />
      </head>

      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-523JV35W"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <SmoothScrollHandler />
        <LeadModal />
        {children}
      </body>
    </html>
  );
}
