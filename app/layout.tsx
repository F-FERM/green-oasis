import type { Metadata } from "next";

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
      <body className="antialiased">
        <SmoothScrollHandler />
        <LeadModal />
        {children}
      </body>
    </html>
  );
}
