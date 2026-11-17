"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Loader2, Send } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import api from "@/lib/axios";
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

  // Footer lead form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCity, setLeadCity] = useState("");
  const [leadDestination, setLeadDestination] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const handleLeadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!leadName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!leadPhone || !isValidPhoneNumber(leadPhone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!leadEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLeadSubmitting(true);

      await api.post("/leads", {
        name: leadName.trim(),
        phone: leadPhone,
        email: leadEmail.trim(),
        city: leadCity.trim(),
        destination: leadDestination.trim(),
      });

      toast.success("Thank you! Our team will contact you shortly.");
      setLeadName("");
      setLeadPhone("");
      setLeadEmail("");
      setLeadCity("");
      setLeadDestination("");
    } catch (err: any) {
      console.error("Footer lead submission error:", err);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLeadSubmitting(false);
    }
  };

  const leadInputClass =
    "h-11 w-full min-w-0 rounded-xl border border-white/20 bg-white/10 px-3.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-[#A4EA6D] focus:bg-white/15";

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
        {/* ====================== TOP: HEADLINE + LEAD FORM ====================== */}
        <div className="grid grid-cols-1 gap-8 border-b border-white/15 pb-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <p
              className="mb-4 text-[11px] uppercase text-[#A4EA6D] sm:text-[12px]"
              style={EYEBROW}
            >
              {eyebrow}
            </p>

            <h1 className="text-[clamp(34px,7vw,76px)] leading-[0.98]">
              <span
                className={`${syne.className} block text-white`}
                style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
              >
                {headA}
              </span>
              <span
                className={`${dmSerif.className} mt-1 block italic text-[#A4EA6D]`}
                style={{ fontWeight: 400, letterSpacing: "-0.04em" }}
              >
                {headB}
              </span>
            </h1>
          </div>

          {/* Compact lead form aligned to the top-right */}
          <div className="w-full lg:ml-auto lg:max-w-[760px]">
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#A4EA6D]">
                LET'S PLAN SOMETHING
              </p>
              <p className="mt-1 text-sm text-white/65">
                Tell us a little about your trip. Our travel team will get in
                touch.
              </p>
            </div>

            <form
              data-lead-form
              onSubmit={handleLeadSubmit}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Full name *"
                aria-label="Full name"
                autoComplete="name"
                required
                className={leadInputClass}
              />

              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="Email address *"
                aria-label="Email address"
                autoComplete="email"
                required
                className={leadInputClass}
              />

              <div className="min-w-0">
                <PhoneInput
                  international
                  defaultCountry={"IN" as Country}
                  countryCallingCodeEditable={false}
                  value={leadPhone}
                  onChange={(value) => setLeadPhone(value || "")}
                  placeholder="Phone number *"
                  className="footer-phone-input"
                />
              </div>

              <input
                type="text"
                value={leadCity}
                onChange={(e) => setLeadCity(e.target.value)}
                placeholder="Your city"
                aria-label="Your city"
                autoComplete="address-level2"
                className={leadInputClass}
              />

              <input
                type="text"
                value={leadDestination}
                onChange={(e) => setLeadDestination(e.target.value)}
                placeholder="Preferred destination"
                aria-label="Preferred destination"
                className={`${leadInputClass} sm:col-span-2`}
              />

              <div className="sm:col-span-2 sm:flex sm:justify-end">
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#A4EA6D] px-7 text-xs font-bold uppercase tracking-wider text-[#004530] transition hover:bg-[#E6FFD0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {leadSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <Send size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

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

      <style jsx global>{`
        .footer-phone-input {
          display: flex;
          align-items: center;
          width: 100%;
          height: 44px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          padding: 0 12px;
          transition:
            border-color 0.2s,
            background 0.2s;
        }

        .footer-phone-input:focus-within {
          border-color: #a4ea6d;
          background: rgba(255, 255, 255, 0.15);
        }

        .footer-phone-input .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-right: 8px;
        }

        .footer-phone-input .PhoneInputCountrySelect {
          cursor: pointer;
          border: none;
          outline: none;
          background: transparent;
        }

        .footer-phone-input .PhoneInputCountryIcon {
          width: 22px;
          height: 16px;
          box-shadow: none;
        }

        .footer-phone-input .PhoneInputInput {
          width: 100%;
          min-width: 0;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 14px;
        }

        .footer-phone-input .PhoneInputInput::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </footer>
  );
}
