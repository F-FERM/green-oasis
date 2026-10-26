"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { DM_Sans, Syne, DM_Serif_Display, Poppins } from "next/font/google";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import heroImg from "../../../public/images/hero.jpg";
import logoImg from "../../../public/images/logo.png";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });
const syne = Syne({ subsets: ["latin"], weight: ["700"] });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

const NAV_LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "Experiences", href: "#experiences" },
  { label: "Discover", href: "#discover" },
  { label: "Why Green Oasis", href: "#why" },
];

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";
const RING_STYLE: CSSProperties = {
  padding: "1.5px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.55) 100%)",
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

export default function Hero() {
  const [open, setOpen] = useState(false);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("cta") || document.getElementById("plan");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#cta");
    }
  };

  return (
    <section
      id="hero"
      className={`
        ${dmSans.className}
        relative
        isolate
        flex
        min-h-[100svh]
        w-full
        flex-col
        overflow-hidden
        border-b-[3px]
        border-[#A4EA6D]
        bg-[#06261c]
        text-white
      `}
    >
      {/* ===================== BACKGROUND ===================== */}
      <Image
        src={heroImg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,69,48,0.55) 0%, rgba(0,40,28,0.3) 45%, rgba(0,30,20,0.8) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,60,40,0.5) 0%, rgba(0,60,40,0.1) 60%, transparent 100%)",
        }}
      />

      {/* ========================= NAV ========================= */}
      <div className={`relative z-20 ${PAD}`}>
        <header
          className="
            relative
            flex
            items-center
            justify-between
            gap-6
            border-b
            border-white/30
            pb-4
            pt-4
            lg:grid
            lg:grid-cols-[1fr_auto_1fr]
            lg:pb-[14px]
            lg:pt-3
          "
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Green Oasis home"
            className="
              relative
              block
              h-[50px]
              w-[167px]
              sm:h-[60px]
              sm:w-[200px]
              lg:h-[70px]
              lg:w-[234px]
              xl:h-[83px]
              xl:w-[278px]
            "
          >
            <Image
              src={logoImg}
              alt="Green Oasis"
              fill
              priority
              sizes="(min-width: 1280px) 278px, (min-width: 1024px) 234px, 200px"
              className="object-contain object-left"
            />
          </Link>

          {/* Menu */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-[38px]">
              {NAV_LINKS.map((l) => (
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
            </ul>
          </nav>

          {/* CTA (desktop) + burger (mobile/tablet) */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="#cta"
              onClick={handleCtaClick}
              className="
                group
                hidden
                min-h-[60px]
                w-[277px]
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
                lg:inline-flex
                xl:text-[18px]
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

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="p-2 lg:hidden"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile dropdown */}
          <ul
            id="mobile-menu"
            className={`
              absolute
              left-0
              right-0
              top-full
              z-30
              mt-2
              overflow-hidden
              rounded-2xl
              bg-[#00281c]/95
              backdrop-blur
              lg:hidden
              ${open ? "block" : "hidden"}
            `}
          >
            {NAV_LINKS.map((l) => (
              <li key={l.label} className="border-b border-white/10 last:border-0">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-4 text-base"
                  style={{ fontWeight: 600 }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </header>
      </div>

      {/* ======================= CONTENT ======================= */}
      <div
        className={`
          relative
          z-10
          flex
          flex-1
          flex-col
          justify-start
          pt-[clamp(28px,11vh,100px)]
          pb-8
          ${PAD}
        `}
      >
        {/* Eyebrow */}
        <p
          className="flex items-center gap-[10px] text-[11px] uppercase sm:text-[12px]"
          style={{ fontWeight: 700, lineHeight: "100%", letterSpacing: "2.16px" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M10 3v14M3 10h14M5 5l10 10M15 5 5 15" />
          </svg>
          Travel is reconnection, not escape
        </p>

        {/* Headline */}
        <h1 className="-mt-1 sm:-mt-2 xl:-mt-3">
          <span
            className={`
              ${syne.className}
              block
              text-[clamp(44px,15vw,72px)]
              text-white
              sm:text-[clamp(64px,10vw,135px)]
              xl:text-[135px]
            `}
            style={{
              fontWeight: 700,
              lineHeight: "1.08",
              letterSpacing: "-0.0325em",
            }}
          >
            Go places.
          </span>
          <span
            className={`
              ${dmSerif.className}
              block
              text-[clamp(44px,15vw,72px)]
              italic
              text-[#A4EA6D]
              sm:text-[clamp(64px,10vw,135px)]
              xl:text-[135px]
            `}
            style={{
              fontWeight: 400,
              lineHeight: "0.95",
              letterSpacing: "-0.0287em",
            }}
          >
            Find yourself.
          </span>
        </h1>

        {/* Paragraph */}
        <p
          className={`
            ${poppins.className}
            mb-7
            mt-5
            max-w-[660px]
            text-[16px]
            leading-[1.6]
            text-[#E8F4EB]
            sm:mt-6
            sm:text-[18px]
            sm:leading-[28.9px]
          `}
          style={{ fontWeight: 400 }}
        >
          Thoughtfully designed journeys that bring you closer to nature, to
          people, and to what matters most.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="#cta"
            onClick={handleCtaClick}
            className="
              group
              inline-flex
              min-h-[60px]
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

          <Link
            href="#story"
            className="group inline-flex items-center gap-[14px] text-[16px] uppercase text-white sm:text-[18px]"
            style={{ fontWeight: 700, lineHeight: "100%" }}
          >
            <span
              className="
                relative
                grid
                h-[48px]
                w-[48px]
                shrink-0
                place-items-center
                rounded-full
                bg-[rgba(120,120,120,0.28)]
                backdrop-blur-md
                transition-colors
                duration-300
                group-hover:bg-[#A4EA6D75]
                group-focus-visible:bg-[#A4EA6D75]
                sm:h-[60px]
                sm:w-[60px]
              "
            >
              {/* gradient ring */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={RING_STYLE}
              />
              <ArrowDownRight
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:-rotate-45 group-focus-visible:-rotate-45"
              />
            </span>
            Discover our story
          </Link>
        </div>
      </div>

      {/* ====================== FOOTER STRIP ====================== */}
      <div
        className={`
          relative
          z-10
          flex
          flex-col
          items-start
          justify-between
          gap-4
          pb-6
          sm:flex-row
          sm:items-end
          sm:pb-10
          ${PAD}
        `}
      >
        <Link
          href="#next"
          className="flex items-center gap-[10px] text-[13px] uppercase sm:text-[16px]"
          style={{ fontWeight: 400, lineHeight: "100%", letterSpacing: "2.2px" }}
        >
          Scroll to reconnect
          <ArrowDown size={16} aria-hidden="true" />
        </Link>

        <p
          className="flex items-baseline gap-[6px] text-[14px] sm:text-[16px]"
          style={{ fontWeight: 400, lineHeight: "100%" }}
        >
          <span
            className="text-[28px] sm:text-[35px]"
            style={{ fontWeight: 700, lineHeight: "84%" }}
          >
            01
          </span>
          / 04 — The journey begins
        </p>
      </div>
    </section>
  );
}