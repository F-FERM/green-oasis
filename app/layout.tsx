import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScrollHandler from "./components/SmoothScrollHandler";

export const metadata: Metadata = {
  title: "Green Oasis",
  description: "Green Oasis",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth")}>
      <body className="antialiased">
        <SmoothScrollHandler />
        {children}
      </body>
    </html>
  );
}
