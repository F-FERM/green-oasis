"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import aboutImg from "../../../public/images/about.png";
import { dmSans, syne, dmSerif, poppins } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

const resolveImg = (path?: string) => {
  if (!path) return "";
  return /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`;
};

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const H_SIZE =
  "text-[clamp(32px,8.8vw,76px)] lg:text-[4.3vw] xl:text-[min(5vw,80px)]";

type AboutData = {
  introEyebrow?: string;
  introHeading?: string;
  introParagraphOne?: string;
  introParagraphTwo?: string;
  introImage?: string;
  introButtonText?: string;
  introButtonLink?: string;
  isActive?: boolean;
};

const FALLBACK = {
  eyebrow: "01 / A different way to travel",
  heading: "It’s not about how far. It’s about how you feel.",
  p1: "Travel is more than the places we visit. It’s the moments that bring us closer, the conversations that stay with us, and the space to reconnect with ourselves.",
  p2: "At Green Oasis, every journey begins with listening. We get to know what matters to you, then thoughtfully shape the experience around it.",
  buttonText: "Get to know us",
  buttonLink: "#why",
};

/* "It’s not about how far. It’s about how you feel." -> 2 sentences */
const toLines = (heading: string) =>
  (heading.match(/[^.!?]+[.!?]+/g) ?? [heading]).map((s) => s.trim());

/* plain part (sans) + accent part (serif italic) */
const splitAccent = (line: string): [string, string] => {
  const i = line.toLowerCase().indexOf("how ");
  if (i > 0) return [line.slice(0, i).trim(), line.slice(i)];
  const w = line.split(" ");
  return [w.slice(0, -2).join(" "), w.slice(-2).join(" ")];
};

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-[#161C1B]/10 ${className}`} />
);

export default function About() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: AboutData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load About:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const eyebrow = data?.introEyebrow || FALLBACK.eyebrow;
  const heading = data?.introHeading || FALLBACK.heading;
  const p1 = data?.introParagraphOne || FALLBACK.p1;
  const p2 = data?.introParagraphTwo || FALLBACK.p2;
  const buttonText = data?.introButtonText || FALLBACK.buttonText;
  const buttonLink = data?.introButtonLink || FALLBACK.buttonLink;
  const imageSrc =
    data?.introImage && !imgFailed ? resolveImg(data.introImage) : aboutImg;

  const lines = toLines(heading);

  return (
    <section
      id="story"
      className={`w-full bg-[#F8F8F3] py-14 sm:py-20 lg:py-24 xl:py-[124px] ${PAD}`}
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1465px]
          items-center
          gap-10
          sm:gap-14
          lg:grid-cols-[minmax(0,1fr)_40%]
          lg:gap-12
          xl:grid-cols-[minmax(0,1fr)_min(615px,36vw)]
          xl:gap-16
        "
      >
        {/* ======================= TEXT ======================= */}
        {loading ? (
          <div className="min-w-0" aria-hidden="true">
            <Bar className="mb-4 h-[12px] w-[220px] sm:mb-5" />
            <Bar className="h-[clamp(32px,6vw,70px)] w-[85%]" />
            <Bar className="mt-3 h-[clamp(32px,6vw,70px)] w-[75%]" />
            <div className="mt-8 max-w-[660px] space-y-3 sm:mt-10 lg:mt-12">
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-[70%]" />
              <Bar className="mt-4 h-4 w-full" />
              <Bar className="h-4 w-[85%]" />
            </div>
            <Bar className="mt-8 h-[60px] w-[277px] max-w-full rounded-[50px]" />
          </div>
        ) : (
          <div className="min-w-0">
            {/* Eyebrow */}
            <p
              className={`${dmSans.className} mb-4 text-[11px] uppercase text-[#161C1B] sm:mb-5 sm:text-[12px]`}
              style={{
                fontWeight: 700,
                lineHeight: "100%",
                letterSpacing: "2.16px",
              }}
            >
              {eyebrow}
            </p>

            {/* Headline */}
            <h2 className={H_SIZE} style={{ lineHeight: "1.05" }}>
              {lines.map((line, i) => {
                const [plain, accent] = splitAccent(line);
                return (
                  <span key={i} className="block whitespace-nowrap">
                    <span
                      className={`${syne.className} text-[#161C1B]`}
                      style={{ fontWeight: 700, letterSpacing: "-0.07em" }}
                    >
                      {plain}{" "}
                    </span>
                    <span
                      className={`${dmSerif.className} italic text-[#0EA766]`}
                      style={{ fontWeight: 400, letterSpacing: "-0.045em" }}
                    >
                      {accent}
                    </span>
                  </span>
                );
              })}
            </h2>

            {/* Paragraphs */}
            <div
              className={`
                ${poppins.className}
                mt-8
                max-w-[660px]
                text-[16px]
                leading-[1.6]
                text-[#536158]
                sm:mt-10
                sm:text-[18px]
                sm:leading-[28.9px]
                lg:mt-12
              `}
              style={{ fontWeight: 400 }}
            >
              <p>{p1}</p>
              <p className="mt-[10px]">{p2}</p>
            </div>

            {/* Button */}
            <Link
              href={buttonLink}
              className={`
                ${dmSans.className}
                group
                mt-8
                inline-flex
                min-h-[60px]
                w-[277px]
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
                sm:text-[18px]
              `}
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
          </div>
        )}

        {/* ======================= IMAGE ======================= */}
        <div
          className="
            relative
            mx-auto
            aspect-[615/608]
            w-full
            max-w-[615px]
            overflow-hidden
            rounded-t-[330px]
            rounded-b-[30px]
            lg:mx-0
            lg:ml-auto
          "
        >
          {loading ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 animate-pulse bg-[#161C1B]/10"
            />
          ) : (
            <Image
              src={imageSrc}
              alt="Mountain valley at sunrise"
              fill
              sizes="(min-width: 1280px) 615px, (min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              onError={() => setImgFailed(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
}