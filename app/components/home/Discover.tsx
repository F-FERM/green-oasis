"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";
import discover1 from "../../../public/images/discover1.jpg";
import discover2 from "../../../public/images/discover2.jpg";
import discover3 from "../../../public/images/discover3.jpg";
import discover4 from "../../../public/images/discover4.jpg";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

const resolveImg = (path?: string) => {
  if (!path) return "";
  return /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`;
};

/* Same side padding as the other sections */
const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const EYEBROW = {
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "2.16px",
} as const;

type Tab = {
  label: string;
  title: string;
  text: string;
  image: string | StaticImageData;
  alt: string;
  buttonText: string;
  buttonLink: string;
};

type Category = {
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  isActive?: boolean;
  _id?: string;
};

type DiscoverData = {
  experiencesEyebrow?: string;
  experiencesHeading?: string;
  experiencesDescription?: string;
  experienceCategories?: Category[];
  isActive?: boolean;
};

/* Current content — used as fallback and to fill fields the API leaves empty */
const FALLBACK_TABS: Tab[] = [
  {
    label: "Nature & Slow Travel",
    title: "Find room to breathe.",
    text: "Quiet mornings, winding trails, and the kind of stillness that stays with you long after you return.",
    image: discover1,
    alt: "Pine trees below a sunlit granite cliff",
    buttonText: "Plan your journey",
    buttonLink: "#cta",
  },
  {
    label: "Culture & Discovery",
    title: "See the world differently.",
    text: "Meet the people, stories and traditions that make every place more than a pin on a map.",
    image: discover2,
    alt: "Traveller exploring a historic old town",
    buttonText: "Plan your journey",
    buttonLink: "#cta",
  },
  {
    label: "Rest & Togetherness",
    title: "Make time for each other.",
    text: "Shared meals, slow afternoons and moments that become stories you tell for years.",
    image: discover3,
    alt: "Friends relaxing together by the water",
    buttonText: "Plan your journey",
    buttonLink: "#cta",
  },
  {
    label: "Journeys of Faith",
    title: "Travel with purpose",
    text: "Thoughtfully considered journeys of faith, reflection and meaningful connection.",
    image: discover4,
    alt: "Pilgrims gathered at a place of worship",
    buttonText: "Plan your journey",
    buttonLink: "#cta",
  },
];

const FALLBACK_HEADER = {
  eyebrow: "03 / Discover what moves you",
  heading: "Follow the feeling. We’ll find the place.",
  description:
    "From unhurried escapes to meaningful journeys of faith, find a way to travel that feels right for you.",
};

/* "Follow the feeling. We’ll find the place." -> [sans, serif] */
const splitSentences = (text: string): [string, string] => {
  const parts = (text.match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim());
  if (parts.length < 2) {
    const w = text.split(" ");
    const cut = Math.ceil(w.length / 2);
    return [w.slice(0, cut).join(" "), w.slice(cut).join(" ")];
  }
  return [parts[0], parts.slice(1).join(" ")];
};

export default function Discover() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<DiscoverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: DiscoverData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load Discover:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  /* ---------- merge API with current content ---------- */
  const categories = [...(data?.experienceCategories ?? [])]
    .filter((c) => c.isActive !== false && c.name)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const TABS: Tab[] = categories.length
    ? categories.map((c, i) => {
        const fb =
          FALLBACK_TABS.find((t) => t.label === c.name) ??
          FALLBACK_TABS[i] ??
          FALLBACK_TABS[0];
        const label = c.name as string;
        return {
          label,
          title: c.title || fb.title,
          text: c.description || fb.text,
          image:
            c.image && !broken[label] ? resolveImg(c.image) : fb.image,
          alt: fb.alt,
          buttonText: c.buttonText || fb.buttonText,
          buttonLink: c.buttonLink || fb.buttonLink,
        };
      })
    : FALLBACK_TABS;

  const header = {
    eyebrow: data?.experiencesEyebrow || FALLBACK_HEADER.eyebrow,
    heading: data?.experiencesHeading || FALLBACK_HEADER.heading,
    description: data?.experiencesDescription || FALLBACK_HEADER.description,
  };
  const [headA, headB] = splitSentences(header.heading);

  const current = Math.min(active, TABS.length - 1);

  return (
    <section
      id="discover"
      className={`${dmSans.className} w-full bg-[#004530] py-14 text-white sm:py-20 ${PAD}`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {/* ========================= HEADER ========================= */}
        {loading ? (
          <div
            aria-hidden="true"
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
          >
            <div>
              <div className="mb-4 h-[12px] w-[240px] animate-pulse rounded bg-white/15 sm:mb-5" />
              <div className="h-[clamp(36px,6vw,72px)] w-[min(560px,85vw)] animate-pulse rounded bg-white/15" />
              <div className="mt-3 h-[clamp(36px,6vw,72px)] w-[min(460px,70vw)] animate-pulse rounded bg-white/15" />
            </div>
            <div className="w-full max-w-[390px] space-y-3 lg:pb-3">
              <div className="h-4 w-full animate-pulse rounded bg-white/15" />
              <div className="h-4 w-[80%] animate-pulse rounded bg-white/15" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0">
              <p
                className="mb-4 text-[11px] uppercase text-white sm:mb-5 sm:text-[12px]"
                style={EYEBROW}
              >
                {header.eyebrow}
              </p>

              <h2 className="text-[clamp(36px,9vw,80px)] lg:text-[clamp(48px,5vw,80px)]">
                <span
                  className={`${syne.className} block text-white`}
                  style={{
                    fontWeight: 700,
                    lineHeight: "0.9685",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {headA}
                </span>
                <span
                  className={`${dmSerif.className} block italic text-[#A4EA6D]`}
                  style={{
                    fontWeight: 400,
                    lineHeight: "0.9685",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {headB}
                </span>
              </h2>
            </div>

            <p
              className="max-w-[390px] text-[16px] leading-[1.5] text-[#E8E8E8] sm:text-[18px] sm:leading-[27px] lg:pb-3"
              style={{ fontWeight: 400 }}
            >
              {header.description}
            </p>
          </div>
        )}

        {loading ? (
          <div aria-hidden="true">
            {/* tabs skeleton */}
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
              {[150, 160, 170, 140].map((w, i) => (
                <div
                  key={i}
                  style={{ width: w }}
                  className="h-[49px] animate-pulse rounded-[40px] bg-white/15"
                />
              ))}
            </div>

            {/* content skeleton */}
            <div className="mt-8 grid items-center gap-8 sm:mt-9 lg:grid-cols-[minmax(0,1.683fr)_minmax(0,1fr)] lg:gap-x-[clamp(32px,5vw,75px)]">
              <div className="aspect-[4/3] w-full animate-pulse rounded-[20px] bg-white/15 sm:aspect-[870/490]" />
              <div className="space-y-5">
                <div className="h-3 w-[160px] animate-pulse rounded bg-white/15" />
                <div className="h-[48px] w-[85%] animate-pulse rounded bg-white/15" />
                <div className="h-4 w-full animate-pulse rounded bg-white/15" />
                <div className="h-4 w-[90%] animate-pulse rounded bg-white/15" />
                <div className="h-4 w-[70%] animate-pulse rounded bg-white/15" />
                <div className="mt-7 h-[60px] w-[277px] max-w-full animate-pulse rounded-[50px] bg-white/15" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ========================== TABS ========================== */}
            <div
              role="tablist"
              aria-label="Travel experiences"
              className="mt-8 flex flex-wrap gap-3 sm:mt-9"
            >
              {TABS.map((tab, i) => {
                const selected = i === current;
                return (
                  <button
                    key={tab.label}
                    type="button"
                    role="tab"
                    id={`discover-tab-${i}`}
                    aria-selected={selected}
                    aria-controls={`discover-panel-${i}`}
                    onClick={() => setActive(i)}
                    className={`
                      min-h-[49px]
                      rounded-[40px]
                      border
                      px-4
                      py-[13px]
                      text-[14px]
                      transition-colors
                      duration-300
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#A4EA6D]
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-[#004530]
                      sm:px-5
                      sm:text-[16px]
                      ${
                        selected
                          ? "border-[#A4EA6D] bg-[#A4EA6D] text-[#004530]"
                          : "border-[#FFFFFF4D] bg-transparent text-white hover:border-white/80 hover:bg-white/10"
                      }
                    `}
                    style={{ fontWeight: 400, lineHeight: "100%" }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ========================= CONTENT ========================= */}
            <div
              className="
                mt-8
                grid
                items-center
                gap-8
                sm:mt-9
                lg:grid-cols-[minmax(0,1.683fr)_minmax(0,1fr)]
                lg:gap-x-[clamp(32px,5vw,75px)]
              "
            >
              {/* ---------- Image (all stacked, cross-fade) ---------- */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:aspect-[870/490]">
                {TABS.map((tab, i) => (
                  <Image
                    key={tab.label}
                    src={tab.image}
                    alt={i === current ? tab.alt : ""}
                    aria-hidden={i !== current}
                    fill
                    sizes="(min-width: 1024px) 870px, 100vw"
                    priority={i === 0}
                    onError={() =>
                      setBroken((prev) => ({ ...prev, [tab.label]: true }))
                    }
                    className={`
                      object-cover
                      transition-opacity
                      duration-500
                      ease-out
                      ${i === current ? "opacity-100" : "opacity-0"}
                    `}
                  />
                ))}
              </div>

              {/* ---------- Text (all stacked in one grid cell) ---------- */}
              <div className="grid min-w-0">
                {TABS.map((tab, i) => {
                  const selected = i === current;
                  return (
                    <div
                      key={tab.label}
                      role="tabpanel"
                      id={`discover-panel-${i}`}
                      aria-labelledby={`discover-tab-${i}`}
                      aria-hidden={!selected}
                      className={`
                        col-start-1
                        row-start-1
                        transition-all
                        duration-500
                        ease-out
                        ${
                          selected
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none invisible translate-y-3 opacity-0"
                        }
                      `}
                    >
                      <p
                        className="text-[11px] uppercase text-[#A4EA6D] sm:text-[12px]"
                        style={EYEBROW}
                      >
                        Experience 0{i + 1} / 0{TABS.length}
                      </p>

                      <h3
                        className={`${syne.className} mt-5 text-[clamp(34px,9vw,59.6px)] text-white lg:text-[clamp(32px,3.1vw,59.6px)] xl:mt-6`}
                        style={{
                          fontWeight: 700,
                          lineHeight: "1.08",
                          letterSpacing: "-0.06em",
                        }}
                      >
                        {tab.title}
                      </h3>

                      <p
                        className="mt-5 max-w-[515px] text-[16px] text-[#B9D5C8] xl:mt-7"
                        style={{ fontWeight: 400, lineHeight: "1.8" }}
                      >
                        {tab.text}
                      </p>

                      <Link
                        href={tab.buttonLink}
                        tabIndex={selected ? 0 : -1}
                        className="
                          group
                          mt-7
                          inline-flex
                          min-h-[60px]
                          w-[277px]
                          max-w-full
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
                          xl:mt-8
                        "
                        style={{ fontWeight: 700, lineHeight: "100%" }}
                      >
                        {tab.buttonText}
                        <ArrowUpRight
                          size={18}
                          aria-hidden="true"
                          className="transition-transform duration-300 ease-out group-hover:rotate-45 group-focus-visible:rotate-45"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}