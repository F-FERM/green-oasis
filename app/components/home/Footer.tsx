import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import footerLogo from "../../../public/images/footerlogo.png";
import { dmSans, dmSerif } from "@/app/fonts";

const FOOTER_LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "Experiences", href: "#experiences" },
  { label: "Discover", href: "#discover" },
  { label: "Why Green Oasis", href: "#why" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className={`${dmSans.className} w-full bg-[#004530] px-5 pb-4 pt-5 text-white sm:px-8 lg:px-10`}
    >
      <div className="mx-auto w-full max-w-[1740px]">
        {/* Logo and Navigation */}
        <div className="flex min-h-[145px] flex-col justify-between gap-8 pb-6 md:flex-row md:items-end">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Green Oasis home"
            className="block w-fit shrink-0"
          >
            <Image
              src={footerLogo}
              alt="Green Oasis"
              priority
              className="h-auto w-[190px] sm:w-[220px] lg:w-[270px]"
            />
          </Link>

          {/* Navigation and Tagline */}
          <div className="flex flex-col gap-4 md:items-end md:pb-1">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[10px] font-semibold transition-colors duration-300 hover:text-[#A4EA6D] sm:text-[11px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <Link
                    href="#hero"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold transition-colors duration-300 hover:text-[#A4EA6D] sm:text-[11px]"
                  >
                    Back to Top
                    <ArrowUp size={12} />
                  </Link>
                </li>
              </ul>
            </nav>

            <p
              className={`${dmSerif.className} text-[19px] italic leading-none text-[#A4EA6D] sm:text-[21px] md:text-right`}
            >
              Travel for you. Return with more.
            </p>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-[#A4EA6D]/30 pt-3">
          <div className="flex flex-col gap-2 text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-[12px]">
            <p>
              © 2026 Green Oasis. All rights reserved.
            </p>

            <p className="sm:text-right">
              Travel is not an escape. It is reconnection.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
