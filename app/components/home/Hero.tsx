"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import heroDesktop from "../../../public/banner/green-oasis-hero-desktop.png";
import logoImg from "../../../public/images/logo.png";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";

const NAV_LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "Experiences", href: "#experiences" },
  { label: "Discover", href: "#discover" },
  { label: "Why Green Oasis", href: "#discover" },
];

const FALLBACK_MOBILE = "/banner/green-oasis-hero-mobile.png";
const FALLBACK_TABLET = "/banner/green-oasis-hero-tablet.png";

type HomeHero = {
  desktopImage?: string;
  tabletImage?: string;
  mobileImage?: string;
  isActive?: boolean;
};

const resolveImg = (path?: string) => {
  if (!path) return "";
  return /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`;
};

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [hero, setHero] = useState<HomeHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_BASE}/home-hero`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data: HomeHero | null = json?.data ?? json ?? null;

        if (data && data.isActive !== false) setHero(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load hero:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchHero();
    return () => controller.abort();
  }, []);

  // API image if available, otherwise the original static asset
  const desktopSrc = hero?.desktopImage
    ? resolveImg(hero.desktopImage)
    : heroDesktop;
  const tabletSrc = hero?.tabletImage
    ? resolveImg(hero.tabletImage)
    : FALLBACK_TABLET;
  const mobileSrc = hero?.mobileImage
    ? resolveImg(hero.mobileImage)
    : FALLBACK_MOBILE;

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const target =
      document.getElementById("cta") || document.getElementById("plan");

    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#cta");
    }
  };

  return (
    <section
      id="hero"
      className="relative isolate min-h-[540px] h-[100svh] w-full overflow-hidden bg-[#65ce70]"
    >
      {/* Responsive hero background */}
      {loading ? (
        // Skeleton
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full animate-pulse bg-gradient-to-br from-[#65ce70] via-[#8be07f] to-[#65ce70]"
        />
      ) : (
        <picture className="absolute inset-0 z-0 block h-full w-full">
          <source media="(max-width: 640px)" srcSet={mobileSrc} />

          <source media="(max-width: 1024px)" srcSet={tabletSrc} />

          <Image
            src={desktopSrc}
            alt="Green Oasis — Green signal"
            fill
            priority
            sizes="100vw"
            quality={100}
            className="object-cover object-center"
          />
        </picture>
      )}

      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-20 px-5 sm:px-8 lg:px-12 xl:px-[4.3%]">
        <header className="relative flex min-h-[64px] items-center justify-between gap-5 border-b border-white/30 py-3 sm:min-h-[72px]">
          <Link
            href="/"
            aria-label="Green Oasis home"
            className="relative block h-[42px] w-[112px] shrink-0 sm:h-[48px] sm:w-[128px]"
          >
            <Image
              src={logoImg}
              alt="Green Oasis"
              fill
              priority
              sizes="128px"
              className="object-contain object-left"
            />
          </Link>

          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="whitespace-nowrap text-[12px] font-semibold text-white transition-colors hover:text-[#b9f27d] xl:text-[13px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0">
            <Link
              href="#cta"
              onClick={handleCtaClick}
              className="group hidden min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#a4ea6d] px-5 text-[12px] font-bold uppercase text-[#004530] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d5ffad] sm:inline-flex lg:min-h-[46px] lg:px-6"
            >
              Plan your journey
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              className="rounded-full p-2 text-white lg:hidden"
            >
              {open ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>

          {/* Mobile navigation */}
          <div
            id="mobile-menu"
            className={`absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl bg-[#004530]/95 shadow-xl backdrop-blur-md lg:hidden ${
              open ? "block" : "hidden"
            }`}
          >
            <nav aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 px-5 py-4 text-sm font-semibold text-white last:border-0 hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="#cta"
                onClick={(e) => {
                  setOpen(false);
                  handleCtaClick(e);
                }}
                className="flex items-center justify-between bg-[#a4ea6d] px-5 py-4 text-sm font-bold uppercase text-[#004530]"
              >
                Plan your journey
                <ArrowUpRight size={17} />
              </Link>
            </nav>
          </div>
        </header>
      </div>
    </section>
  );
}