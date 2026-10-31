import { DM_Sans, Syne, DM_Serif_Display, Poppins } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
