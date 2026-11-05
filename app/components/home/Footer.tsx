"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import footerLogo from "../../../public/images/footerlogo.png";
import { dmSans, syne, dmSerif, poppins } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/footer`;

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const EYEBROW = {
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "2.16px",
} as const;

/* Phone / email text size */
const CONTACT_SIZE = "text-[clamp(20px,5.6vw,35px)] lg:text-[35px]";

type ApiOffice = {
  label?: string;
  name?: string;
  address?: string;
  order?: number;
  isActive?: boolean;
  _id?: string;
};

type ApiNav = {
  label?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
  _id?: string;
};

type FooterData = {
  eyebrow?: string;
  heading?: string;
  buttonText?: string;
  buttonLink?: string;
  callLabel?: string;
  phone?: string;
  emailLabel?: string;
  email?: string;
  locationsLabel?: string;
  locationsHeading?: string;
  offices?: ApiOffice[];
  brandName?: string;
  navigation?: ApiNav[];
  marqueeText?: string;
  copyright?: string;
  tagline?: string;
  isActive?: boolean;
};

/* ---------- Current content (fallback) ---------- */
const FALLBACK = {
  eyebrow: "Green Oasis · Let’s connect",
  heading: "Every great journey starts with a hello.",
  buttonText: "Plan your journey",
  buttonLink: "#cta",
  callLabel: "Call us",
  phone: "+91 79943 82999",
  emailLabel: "Write to us",
  email: "info@greenoasistravel.com",
  locationsLabel: "Find us",
  locationsHeading: "Four places. One warm welcome.",
  brandName: "Green Oasis",
  marqueeText: "Travel for you. Return with more.",
  copyright: "© 2026 Green Oasis. All rights reserved.",
  tagline: "Travel is not an escape. It is reconnection.",
};

const FALLBACK_OFFICES = [
  {
    id: "malappuram",
    tag: "01 / Head office",
    city: "Malappuram",
    address:
      "1st Floor, Kunnummal Juma Masjid Complex, Up Hill, Malappuram - 676505, Kerala, India.",
  },
  {
    id: "calicut",
    tag: "02 / Branch office",
    city: "Calicut",
    address:
      "3rd Floor, Door No. 1307, Tower 1, HiLITE Business Park, Poovangal, Pantheeramkavu, Kozhikode, Kerala - 673014, India.",
  },
  {
    id: "kochi",
    tag: "03 / Branch office",
    city: "Kochi",
    address:
      "3A, Oxford Business Center, Sreekandath Road, Ravipuram, Perumanoor, Kochi, Ernakulam, Kerala - 682016, India.",
  },
  {
    id: "nedumbassery",
    tag: "04 / Airport office",
    city: "Nedumbassery",
    address:
      "GREEN OASIS TOURS & TRAVELS, 2nd Floor, G-Tower, NH 544, Athani PO, Near Kochi International Airport, Nedumbassery, Kochi, Kerala - 683585, India.",
  },
];

const FALLBACK_LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "Experiences", href: "#experiences" },
  { label: "Discover", href: "#discover" },
  { label: "Why Green Oasis", href: "#why" },
];

const FALLBACK_BACK_TO_TOP = { label: "Back to Top", href: "#hero" };

/* "Every great journey starts with a hello."
   -> ["Every great journey", "starts with a hello."] */
const splitHeading = (text: string): [string, string] => {
  const i = text.toLowerCase().indexOf(" starts ");
  if (i > 0) return [text.slice(0, i), text.slice(i + 1)];
  const w = text.trim().split(/\s+/);
  const cut = Math.ceil(w.length / 2);
  return [w.slice(0, cut).join(" "), w.slice(cut).join(" ")];
};

/* "+91 79943 82999" -> "+917994382999" */
const toTel = (phone: string) => phone.replace(/[^\d+]/g, "");

/* The page's top section has id="hero", so map "#top" to it */
const fixTopLink = (link?: string) =>
  !link || link === "#top" ? "#hero" : link;

const isBackToTop = (n: ApiNav) =>
  /back\s*to\s*top/i.test(n.label ?? "") || n.link === "#top";

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-white/15 ${className}`} />
);

export default function Footer() {
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: FooterData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load footer:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  /* ---------- map API -> UI (fallback to current content) ---------- */
  const eyebrow = data?.eyebrow || FALLBACK.eyebrow;
  const heading = data?.heading || FALLBACK.heading;
  const buttonText = data?.buttonText || FALLBACK.buttonText;
  const buttonLink = data?.buttonLink || FALLBACK.buttonLink;
  const callLabel = data?.callLabel || FALLBACK.callLabel;
  const phone = data?.phone || FALLBACK.phone;
  const emailLabel = data?.emailLabel || FALLBACK.emailLabel;
  const email = data?.email || FALLBACK.email;
  const locationsLabel = data?.locationsLabel || FALLBACK.locationsLabel;
  const locationsHeading = data?.locationsHeading || FALLBACK.locationsHeading;
  const brandName = data?.brandName || FALLBACK.brandName;
  const marqueeText = data?.marqueeText || FALLBACK.marqueeText;
  const copyright = data?.copyright || FALLBACK.copyright;
  const tagline = data?.tagline || FALLBACK.tagline;

  const [headA, headB] = splitHeading(heading);

  const apiOffices = [...(data?.offices ?? [])]
    .filter((o) => o.isActive !== false && o.name)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const OFFICES = apiOffices.length
    ? apiOffices.map((o, i) => ({
        id: o._id ?? `${o.name}-${i}`,
        tag: o.label ?? "",
        city: o.name ?? "",
        address: o.address ?? "",
      }))
    : FALLBACK_OFFICES;

  const apiNav = [...(data?.navigation ?? [])]
    .filter((n) => n.isActive !== false && n.label)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const LINKS = apiNav.length
    ? apiNav
        .filter((n) => !isBackToTop(n))
        .map((n) => ({ label: n.label as string, href: n.link || "#" }))
    : FALLBACK_LINKS;

  const topItem = apiNav.find(isBackToTop);
  const BACK_TO_TOP = topItem
    ? { label: topItem.label as string, href: fixTopLink(topItem.link) }
    : FALLBACK_BACK_TO_TOP;

  return (
    <footer
      id="contact"
      className={`${dmSans.className} w-full bg-[#004530] pb-6 pt-12 text-white xl:pt-10 ${PAD}`}
    >
      <div className="mx-auto w-full max-w-[1740px]">
        {/* ====================== TOP: headline + button ====================== */}
        {loading ? (
          <div
            aria-hidden="true"
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
          >
            <div className="min-w-0">
              <Bar className="mb-4 h-[12px] w-[210px]" />
              <Bar className="h-[clamp(32px,6vw,72px)] w-[min(620px,90vw)]" />
              <Bar className="mt-3 h-[clamp(32px,6vw,72px)] w-[min(540px,80vw)]" />
            </div>
            <Bar className="h-[60px] w-[277px] max-w-full rounded-[50px]" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0">
              <p
                className="mb-4 text-[11px] uppercase text-[#A4EA6D] sm:text-[12px]"
                style={EYEBROW}
              >
                {eyebrow}
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
                  {headA}
                </span>
                <span
                  className={`${dmSerif.className} block whitespace-nowrap italic text-[#A4EA6D]`}
                  style={{
                    fontWeight: 400,
                    lineHeight: "0.9685",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {headB}
                </span>
              </p>
            </div>

            <Link
              href={buttonLink}
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
              {buttonText}
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:rotate-45 group-focus-visible:rotate-45"
              />
            </Link>
          </div>
        )}

        {/* ====================== CALL / WRITE ====================== */}
        {loading ? (
          <div
            aria-hidden="true"
            className="mt-8 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10"
          >
            <div className="min-w-0">
              <Bar className="h-[12px] w-[80px]" />
              <Bar className="mt-3 h-[clamp(24px,5vw,34px)] w-[min(300px,70vw)]" />
            </div>
            <div className="min-w-0">
              <Bar className="h-[12px] w-[100px]" />
              <Bar className="mt-3 h-[clamp(24px,5vw,34px)] w-[min(420px,85vw)]" />
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
            <div className="min-w-0">
              <p
                className="text-[11px] uppercase text-white sm:text-[12px]"
                style={EYEBROW}
              >
                {callLabel}
              </p>
              <a
                href={`tel:${toTel(phone)}`}
                className={`${poppins.className} ${CONTACT_SIZE} mt-3 block text-white transition-colors hover:text-[#A4EA6D]`}
                style={{ fontWeight: 600, lineHeight: "1.45" }}
              >
                {phone}
              </a>
            </div>

            {/* Left-aligned: label and email both start at the same left edge */}
            <div className="min-w-0">
              <p
                className="text-[11px] uppercase text-white sm:text-[12px]"
                style={EYEBROW}
              >
                {emailLabel}
              </p>
              <a
                href={`mailto:${email}`}
                className={`${poppins.className} ${CONTACT_SIZE} mt-3 block break-words text-white transition-colors hover:text-[#A4EA6D]`}
                style={{ fontWeight: 600, lineHeight: "1.45" }}
              >
                {email}
              </a>
            </div>
          </div>
        )}

        {/* ====================== FIND US ====================== */}
        {loading ? (
          <div aria-hidden="true" className="mt-7">
            <Bar className="h-[12px] w-[70px]" />
            <Bar className="mt-4 h-[30px] w-[min(420px,85vw)]" />
          </div>
        ) : (
          <div className="mt-7">
            <p
              className="text-[11px] uppercase text-[#A4EA6D] sm:text-[12px]"
              style={EYEBROW}
            >
              {locationsLabel}
            </p>
            <h2
              className={`${syne.className} mt-4 text-[clamp(22px,6vw,30px)] text-white`}
              style={{ fontWeight: 700, lineHeight: "100%" }}
            >
              {locationsHeading}
            </h2>
          </div>
        )}

        {/* ====================== OFFICES ====================== */}
        <ul className="mt-10 grid grid-cols-1 gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 xl:gap-x-12">
          {loading
            ? FALLBACK_OFFICES.map((o) => (
                <li key={o.id} aria-hidden="true">
                  <Bar className="h-[12px] w-[130px]" />
                  <Bar className="mt-5 h-[26px] w-[150px]" />
                  <Bar className="mt-4 h-4 w-full" />
                  <Bar className="mt-2 h-4 w-[90%]" />
                  <Bar className="mt-2 h-4 w-[65%]" />
                </li>
              ))
            : OFFICES.map((o) => (
                <li key={o.id}>
                  <p
                    className="text-[11px] uppercase text-white sm:text-[12px]"
                    style={EYEBROW}
                  >
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
          <Link
            href="/"
            aria-label={`${brandName} home`}
            className="block w-fit"
          >
            <Image
              src={footerLogo}
              alt={brandName}
              className="h-auto w-[220px] sm:w-[300px] lg:w-[340px] xl:w-[414px]"
            />
          </Link>

          {loading ? (
            <div
              aria-hidden="true"
              className="flex flex-col gap-6 lg:items-end lg:gap-[30px]"
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
                {[70, 90, 70, 110, 90].map((w, i) => (
                  <Bar key={i} className="h-[14px]" />
                ))}
              </div>
              <Bar className="h-[30px] w-[min(380px,85vw)]" />
            </div>
          ) : (
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
                      href={BACK_TO_TOP.href}
                      className="inline-flex items-center gap-1 text-[14px] text-white transition-colors hover:text-[#A4EA6D]"
                      style={{ fontWeight: 600, lineHeight: "100%" }}
                    >
                      {BACK_TO_TOP.label}
                      <ArrowUp size={14} aria-hidden="true" />
                    </Link>
                  </li>
                </ul>
              </nav>

              <p
                className={`${dmSerif.className} text-[clamp(22px,6vw,30px)] italic text-[#A4EA6D] lg:text-right`}
                style={{ fontWeight: 400, lineHeight: "100%" }}
              >
                {marqueeText}
              </p>
            </div>
          )}
        </div>

        {/* ====================== BOTTOM BAR ====================== */}
        {loading ? (
          <div
            aria-hidden="true"
            className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <Bar className="h-4 w-[min(300px,80vw)]" />
            <Bar className="h-4 w-[min(340px,85vw)]" />
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-[14px] text-[#AAAAAA] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-[16px] xl:text-[18px]">
            <p style={{ fontWeight: 400, lineHeight: "1.322" }}>{copyright}</p>
            <p style={{ fontWeight: 400, lineHeight: "1.322" }}>{tagline}</p>
          </div>
        )}
      </div>
    </footer>
  );
}