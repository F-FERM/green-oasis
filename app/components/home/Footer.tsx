import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import footerLogo from "../../../public/images/footerlogo.png";
import { dmSans, syne, dmSerif, poppins } from "@/app/fonts";

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const EYEBROW = {
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "2.16px",
} as const;

const OFFICES = [
  {
    tag: "01 / Head office",
    city: "Malappuram",
    address:
      "1st Floor, Kunnummal Juma Masjid Complex, Up Hill, Malappuram - 676505, Kerala, India.",
  },
  {
    tag: "02 / Branch office",
    city: "Calicut",
    address:
      "3rd Floor, Door No. 1307, Tower 1, HiLITE Business Park, Poovangal, Pantheeramkavu, Kozhikode, Kerala - 673014, India.",
  },
  {
    tag: "03 / Branch office",
    city: "Kochi",
    address:
      "3A, Oxford Business Center, Sreekandath Road, Ravipuram, Perumanoor, Kochi, Ernakulam, Kerala - 682016, India.",
  },
  {
    tag: "04 / Airport office",
    city: "Nedumbassery",
    address:
      "GREEN OASIS TOURS & TRAVELS, 2nd Floor, G-Tower, NH 544, Athani PO, Near Kochi International Airport, Nedumbassery, Kochi, Kerala - 683585, India.",
  },
];

const LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "Experiences", href: "#experiences" },
  { label: "Discover", href: "#discover" },
  { label: "Why Green Oasis", href: "#why" },
];

/* Phone / email text size */
const CONTACT_SIZE = "text-[clamp(20px,5.6vw,35px)] lg:text-[35px]";

export default function Footer() {
  return (
    <footer
      id="contact"
      className={`${dmSans.className} w-full bg-[#004530] pb-6 pt-12 text-white xl:pt-10 ${PAD}`}
    >
      <div className="mx-auto w-full max-w-[1740px]">
        {/* ====================== TOP: headline + button ====================== */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <p
              className="mb-4 text-[11px] uppercase text-[#A4EA6D] sm:text-[12px]"
              style={EYEBROW}
            >
              Green Oasis · Let’s connect
            </p>

            <p className="text-[clamp(32px,8.6vw,80px)] lg:text-[clamp(52px,5vw,80px)]">
              <span
                className={`${syne.className} block whitespace-nowrap text-white`}
                style={{
                  fontWeight: 700,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.04em",
                }}
              >
                Every great journey
              </span>
              <span
                className={`${dmSerif.className} block whitespace-nowrap italic text-[#A4EA6D]`}
                style={{
                  fontWeight: 400,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.04em",
                }}
              >
                starts with a hello.
              </span>
            </p>
          </div>

          <Link
            href="#cta"
            className="
              group
              inline-flex
              min-h-[60px]
              w-[277px]
              max-w-full
              shrink-0
              items-center
              justify-center
              gap-[10px]
              rounded-[50px]
              bg-[#A4EA6D]
              px-[25px]
              py-[17px]
              text-[16px]
              uppercase
              text-[#004530]
              transition-all
              duration-300
              ease-out
              hover:-translate-y-1
              hover:bg-[#E6FFD0]
              focus-visible:-translate-y-1
              focus-visible:bg-[#E6FFD0]
              sm:text-[18px]
            "
            style={{ fontWeight: 700, lineHeight: "100%" }}
          >
            Plan your journey
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:rotate-45 group-focus-visible:rotate-45"
            />
          </Link>
        </div>

        {/* ====================== CALL / WRITE ====================== */}
        <div className="mt-8 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div className="min-w-0">
            <p className="text-[11px] uppercase text-white sm:text-[12px]" style={EYEBROW}>
              Call us
            </p>
            <a
              href="tel:+917994382999"
              className={`${poppins.className} ${CONTACT_SIZE} mt-3 block text-white transition-colors hover:text-[#A4EA6D]`}
              style={{ fontWeight: 600, lineHeight: "1.45" }}
            >
              +91 79943 82999
            </a>
          </div>

          {/* Left-aligned: label and email both start at the same left edge */}
          <div className="min-w-0">
            <p className="text-[11px] uppercase text-white sm:text-[12px]" style={EYEBROW}>
              Write to us
            </p>
            <a
              href="mailto:info@greenoasistravel.com"
              className={`${poppins.className} ${CONTACT_SIZE} mt-3 block break-words text-white transition-colors hover:text-[#A4EA6D]`}
              style={{ fontWeight: 600, lineHeight: "1.45" }}
            >
              info@greenoasistravel.com
            </a>
          </div>
        </div>

        {/* ====================== FIND US ====================== */}
        <div className="mt-7">
          <p className="text-[11px] uppercase text-[#A4EA6D] sm:text-[12px]" style={EYEBROW}>
            Find us
          </p>
          <h2
            className={`${syne.className} mt-4 text-[clamp(22px,6vw,30px)] text-white`}
            style={{ fontWeight: 700, lineHeight: "100%" }}
          >
            Four places. One warm welcome.
          </h2>
        </div>

        {/* ====================== OFFICES ====================== */}
        <ul className="mt-10 grid grid-cols-1 gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 xl:gap-x-12">
          {OFFICES.map((o) => (
            <li key={o.city}>
              <p className="text-[11px] uppercase text-white sm:text-[12px]" style={EYEBROW}>
                {o.tag}
              </p>
              <h3
                className={`${syne.className} mt-5 text-[24px] text-white xl:text-[28px]`}
                style={{ fontWeight: 700, lineHeight: "100%" }}
              >
                {o.city}
              </h3>
              <address
                className="mt-4 text-[16px] not-italic text-[#AAAAAA] lg:text-[clamp(14px,1.1vw,18px)] xl:text-[18px]"
                style={{ fontWeight: 400, lineHeight: "1.322" }}
              >
                {o.address}
              </address>
            </li>
          ))}
        </ul>

        {/* ====================== LOGO + LINKS ====================== */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Link href="/" aria-label="Green Oasis home" className="block w-fit">
            <Image
              src={footerLogo}
              alt="Green Oasis"
              className="h-auto w-[220px] sm:w-[300px] lg:w-[340px] xl:w-[414px]"
            />
          </Link>

          <div className="flex flex-col gap-6 lg:items-end lg:gap-[30px]">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
                {LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-white transition-colors hover:text-[#A4EA6D]"
                      style={{ fontWeight: 600, lineHeight: "100%" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="#hero"
                    className="inline-flex items-center gap-1 text-[14px] text-white transition-colors hover:text-[#A4EA6D]"
                    style={{ fontWeight: 600, lineHeight: "100%" }}
                  >
                    Back to Top
                    <ArrowUp size={14} aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </nav>

            <p
              className={`${dmSerif.className} text-[clamp(22px,6vw,30px)] italic text-[#A4EA6D] lg:text-right`}
              style={{ fontWeight: 400, lineHeight: "100%" }}
            >
              Travel for you. Return with more.
            </p>
          </div>
        </div>

        {/* ====================== BOTTOM BAR ====================== */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-[14px] text-[#AAAAAA] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-[16px] xl:text-[18px]">
          <p style={{ fontWeight: 400, lineHeight: "1.322" }}>
            © 2026 Green Oasis. All rights reserved.
          </p>
          <p style={{ fontWeight: 400, lineHeight: "1.322" }}>
            Travel is not an escape. It is reconnection.
          </p>
        </div>
      </div>
    </footer>
  );
}