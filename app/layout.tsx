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
        {/* Google Tag Manager - HEAD */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-523JV35W');
            `,
          }}
        />
      </head>

      <body className="antialiased">
        {/* Google Tag Manager - BODY */}
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
