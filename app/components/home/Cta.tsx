"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

type CtaData = {
  finalCtaEyebrow?: string;
  finalCtaHeading?: string;
  finalCtaDescription?: string;
  finalCtaButtonText?: string;
  finalCtaButtonLink?: string;
  finalCtaNote?: string;
  isActive?: boolean;
};

const FALLBACK = {
  eyebrow: "Your next chapter starts here",
  heading: "Let’s go somewhere that means more.",
  description:
    "Tell us where you’re dreaming of going, or simply how you want to feel. We’ll start with a conversation.",
  buttonText: "Start a conversation",
  buttonLink: "#contact",
  note: "Demo enquiry link — replace with the official Green Oasis contact details before publishing.",
};

/* "Let’s go somewhere that means more."
   -> "Let’s go" / "somewhere" / "that means more." (last 3 words = serif) */
const splitHeading = (text: string) => {
  const words = text.trim().split(/\s+/);
  const serif = words.slice(-3).join(" ");
  const sans = words.slice(0, -3);
  return {
    line1: sans.slice(0, 2).join(" "),
    line2: sans.slice(2).join(" "),
    serif,
  };
};

export default function Cta() {
  const [data, setData] = useState<CtaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: CtaData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load CTA:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const eyebrow = data?.finalCtaEyebrow || FALLBACK.eyebrow;
  const heading = data?.finalCtaHeading || FALLBACK.heading;
  const description = data?.finalCtaDescription || FALLBACK.description;
  const buttonText = data?.finalCtaButtonText || FALLBACK.buttonText;
  const buttonLink = data?.finalCtaButtonLink || FALLBACK.buttonLink;
  const note = data ? data.finalCtaNote : FALLBACK.note;

  const { line1, line2, serif } = splitHeading(heading);

  return (
    <section
      id="cta"
      className={`${dmSans.className} relative w-full bg-[#A4EA6D] py-14 text-center sm:py-20 xl:py-[80px] ${PAD}`}
    >
      <span id="plan" className="sr-only" />
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center">
        {loading ? (
          <div
            aria-hidden="true"
            className="flex w-full flex-col items-center"
          >
            <div className="mb-3 h-[12px] w-[230px] animate-pulse rounded bg-[#004530]/15 sm:mb-4" />
            <div className="h-[clamp(40px,11vw,78px)] w-[min(420px,80%)] animate-pulse rounded bg-[#004530]/15" />
            <div className="mt-2 h-[clamp(40px,11vw,78px)] w-[min(480px,90%)] animate-pulse rounded bg-[#004530]/15" />
            <div className="mt-2 h-[clamp(40px,11vw,78px)] w-[min(560px,95%)] animate-pulse rounded bg-[#004530]/15" />
            <div className="mt-6 w-full max-w-[640px] space-y-3 sm:mt-8">
              <div className="h-4 w-full animate-pulse rounded bg-[#004530]/15" />
              <div className="mx-auto h-4 w-[75%] animate-pulse rounded bg-[#004530]/15" />
            </div>
            <div className="mt-6 h-[60px] w-[280px] animate-pulse rounded-[50px] bg-[#004530]/15 sm:mt-7" />
          </div>
        ) : (
          <>
            {/* Eyebrow */}
            <p
              className="mb-3 text-[11px] uppercase text-black sm:mb-4 sm:text-[12px]"
              style={{
                fontWeight: 700,
                lineHeight: "100%",
                letterSpacing: "2.16px",
              }}
            >
              {eyebrow}
            </p>

            <h2 className="text-[clamp(40px,11vw,80px)] text-[#004530]">
              {line1 && (
                <span
                  className={`${syne.className} block whitespace-nowrap`}
                  style={{
                    fontWeight: 700,
                    lineHeight: "0.97",
                    letterSpacing: "-0.0424em",
                  }}
                >
                  {line1}
                </span>
              )}
              {line2 && (
                <span
                  className={`${syne.className} block whitespace-nowrap`}
                  style={{
                    fontWeight: 700,
                    lineHeight: "0.97",
                    letterSpacing: "-0.0424em",
                  }}
                >
                  {line2}
                </span>
              )}
              <span
                className={`${dmSerif.className} block whitespace-nowrap italic`}
                style={{
                  fontWeight: 400,
                  lineHeight: "1.17",
                  letterSpacing: "-0.0485em",
                }}
              >
                {serif}
              </span>
            </h2>

            {/* Paragraph */}
            <p
              className="mt-6 max-w-[640px] text-[16px] leading-[1.6] text-[#3A3A3A] sm:mt-8 sm:text-[18px] sm:leading-[28px]"
              style={{ fontWeight: 400 }}
            >
              {description}
            </p>

            {/* Button */}
            <Link
              href={buttonLink}
              className="
                group
                mt-6
                inline-flex
                min-h-[60px]
                max-w-full
                items-center
                justify-center
                gap-[10px]
                rounded-[50px]
                bg-[#004530]
                px-[25px]
                py-[17px]
                text-[16px]
                uppercase
                text-white
                transition-all
                duration-300
                ease-out
                hover:-translate-y-1
                hover:bg-[#00B57E]
                hover:shadow-[0_12px_24px_rgba(0,181,126,0.25)]
                focus-visible:-translate-y-1
                focus-visible:bg-[#00B57E]
                sm:mt-7
                sm:px-[38px]
                sm:text-[18px]
              "
              style={{ fontWeight: 700, lineHeight: "100%" }}
            >
              {buttonText}
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="
                  transition-transform
                  duration-300
                  ease-out
                  group-hover:rotate-45
                  group-focus-visible:rotate-45
                "
              />
            </Link>

            {/* Note from the API (hidden automatically if empty) */}
            {note && (
              <p
                className="mt-5 max-w-[620px] text-[16px] leading-[1.6] text-[#3A3A3A] sm:text-[18px] sm:leading-[28px]"
                style={{ fontWeight: 400 }}
              >
                {note}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}