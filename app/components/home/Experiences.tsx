"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";
import image1 from "../../../public/images/ex1.jpg";
import image2 from "../../../public/images/ex2.jpg";
import image3 from "../../../public/images/ex3.jpg";
import image4 from "../../../public/images/ex4.jpg";
import image5 from "../../../public/images/ex5.jpg";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

const resolveImg = (path?: string) => {
  if (!path) return "";
  return /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`;
};

/* Same side padding as Hero / Founder */
const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

type Destination = {
  title?: string;
  subtitle?: string;
  priceText?: string;
  image?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
  _id?: string;
};

type ExperiencesData = {
  destinationsEyebrow?: string;
  destinationsHeading?: string;
  destinationsDescription?: string;
  destinations?: Destination[];
  destinationCtaTitle?: string;
  destinationCtaDescription?: string;
  destinationCtaButtonText?: string;
  destinationCtaButtonLink?: string;
  isActive?: boolean;
};

type Pkg = {
  id: string;
  duration: string;
  title: string;
  prefix: string;
  price: string;
  suffix: string;
  image: string | StaticImageData;
  href: string;
};

const FALLBACK_IMAGES = [image1, image2, image3, image4, image5];

const FALLBACK_PACKAGES: Pkg[] = [
  {
    id: "almaty",
    duration: "5 Days 4 Night",
    title: "Explore Almaty: Mountains, Canyons & Lakes",
    prefix: "From",
    price: "₹120,000",
    suffix: "/Per Person",
    image: image1,
    href: "/experiences/almaty",
  },
  {
    id: "georgia-armenia",
    duration: "",
    title: "Georgia and Armenia",
    prefix: "From",
    price: "₹1,88,000",
    suffix: "/Per Person",
    image: image2,
    href: "/experiences/georgia-armenia",
  },
  {
    id: "azerbaijan",
    duration: "5 Days 4 Night",
    title: "Azerbaijan Explorer",
    prefix: "From",
    price: "₹1,10,000",
    suffix: "/Per Person",
    image: image3,
    href: "/experiences/azerbaijan",
  },
  {
    id: "egypt",
    duration: "5 Days 4 Night",
    title: "Discover Egypt",
    prefix: "From",
    price: "₹1,02,000",
    suffix: "/Per Person",
    image: image4,
    href: "/experiences/egypt",
  },
  {
    id: "thailand",
    duration: "5 Days 4 Night",
    title: "Thailand",
    prefix: "From",
    price: "₹65,500",
    suffix: "/Per Person",
    image: image5,
    href: "/experiences/thailand",
  },
];

const FALLBACK_HEADER = {
  eyebrow: "02 / Experiences made for you",
  heading: "Every journey has a reason.",
  description:
    "From unhurried escapes to meaningful journeys of faith, find a way to travel that feels right for you.",
};

const FALLBACK_CTA = {
  title: "Have somewhere in mind?",
  description: "Tell us what matters. We’ll take it from there.",
  buttonText: "Let’s make it personal",
  buttonLink: "#cta",
  ariaLabel: "Plan your journey",
};

/* "From ₹120,000 /Per Person" -> { From | ₹120,000 | /Per Person } */
const parsePrice = (text = "") => {
  const m = text.match(/^(.*?)\s*([₹$€£]\s?[\d.,]+)\s*(.*)$/);
  return m
    ? { prefix: m[1], price: m[2], suffix: m[3] }
    : { prefix: text, price: "", suffix: "" };
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* "Every journey has a reason." -> ["Every journey", "has a reason."] */
const splitHeading = (text: string): [string, string] => {
  const i = text.toLowerCase().indexOf(" has ");
  if (i > 0) return [text.slice(0, i), text.slice(i + 1)];
  const w = text.split(" ");
  const cut = Math.ceil(w.length / 2);
  return [w.slice(0, cut).join(" "), w.slice(cut).join(" ")];
};

const CARD = `
  group relative isolate flex
  min-h-[380px] w-full flex-col justify-end
  overflow-hidden rounded-[20px]
  [container-type:inline-size]
  [--c:clamp(40px,14.1cqw,60px)]
  [transform:translateZ(0)]
  sm:min-h-[340px] sm:aspect-[425/450]
`;

const INNER =
  "z-10 flex flex-col px-[5.65cqw] pb-[6.6cqw] pt-[5.65cqw]";

const EYEBROW = {
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "2.16px",
} as const;

const EYEBROW_SIZE = "text-[clamp(10px,2.82cqw,12px)]";

const RING_STYLE = {
  padding: "1.5px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.55) 100%)",
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as React.CSSProperties;

function ArrowCircle({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: "glass" | "lime";
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`
        after:absolute
        after:inset-0
        after:z-20
        after:content-['']
        focus:outline-none
        focus-visible:after:ring-2
        ${
          tone === "glass"
            ? "focus-visible:after:ring-[#A4EA6D]"
            : "focus-visible:after:ring-[#004530]"
        }
      `}
    >
      <span
        className={`
          absolute
          bottom-[7cqw]
          right-[5.65cqw]
          grid
          h-[var(--c)]
          w-[var(--c)]
          place-items-center
          rounded-full
          bg-[rgba(120,120,120,0.28)]
          backdrop-blur-md
          transition-colors
          duration-300
          ${
            tone === "glass"
              ? "text-white group-hover:bg-[#A4EA6D75]"
              : "text-[#004530] group-hover:bg-[#004530] group-hover:text-[#A4EA6D]"
          }
        `}
      >
        {/* gradient ring */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={RING_STYLE}
        />
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="h-[44%] w-[44%] transition-transform duration-300 ease-out group-hover:rotate-45"
        />
      </span>
    </Link>
  );
}

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-[#004530]/10 ${className}`} />
);

export default function Experiences() {
  const [data, setData] = useState<ExperiencesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: ExperiencesData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load Experiences:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  /* ---------- map API -> UI shape (fallback to current content) ---------- */
  const apiDestinations = [...(data?.destinations ?? [])]
    .filter((d) => d.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const packages: Pkg[] = apiDestinations.length
    ? apiDestinations.map((d, i) => {
        const title = d.title ?? "";
        const { prefix, price, suffix } = parsePrice(d.priceText);
        return {
          id: d._id ?? `${slugify(title)}-${i}`,
          duration: d.subtitle ?? "",
          title,
          prefix,
          price,
          suffix,
          image: d.image
            ? resolveImg(d.image)
            : FALLBACK_IMAGES[i] ?? FALLBACK_IMAGES[0],
          href:
            d.link ??
            FALLBACK_PACKAGES[i]?.href ??
            `/experiences/${slugify(title)}`,
        };
      })
    : FALLBACK_PACKAGES;

  const header = {
    eyebrow: data?.destinationsEyebrow || FALLBACK_HEADER.eyebrow,
    heading: data?.destinationsHeading || FALLBACK_HEADER.heading,
    description: data?.destinationsDescription || FALLBACK_HEADER.description,
  };
  const [headA, headB] = splitHeading(header.heading);

  const cta = {
    title: data?.destinationCtaTitle || FALLBACK_CTA.title,
    description: data?.destinationCtaDescription || FALLBACK_CTA.description,
    buttonText: data?.destinationCtaButtonText || FALLBACK_CTA.buttonText,
    buttonLink: data?.destinationCtaButtonLink || FALLBACK_CTA.buttonLink,
  };
  /* "Have somewhere in mind?" -> Have / somewhere / in mind? */
  const [t1, t2, ...tRest] = cta.title.split(" ");
  const ctaLines = [t1, t2, tRest.join(" ")].filter(Boolean);

  return (
    <section
      id="experiences"
      className={`${dmSans.className} w-full bg-[#EAF3E7] py-14 sm:py-20 xl:py-[90px] ${PAD}`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {/* ========================= HEADER ========================= */}
        {loading ? (
          <div
            aria-hidden="true"
            className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
          >
            <div>
              <Bar className="mb-4 h-[12px] w-[240px] sm:mb-5" />
              <Bar className="h-[clamp(40px,7vw,72px)] w-[min(520px,80vw)]" />
              <Bar className="mt-3 h-[clamp(40px,7vw,72px)] w-[min(420px,65vw)]" />
            </div>
            <div className="w-full max-w-[390px] space-y-3 lg:pb-3">
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-[80%]" />
            </div>
          </div>
        ) : (
          <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div>
              <p
                className="mb-4 text-[11px] uppercase text-[#161C1B] sm:mb-5 sm:text-[12px]"
                style={EYEBROW}
              >
                {header.eyebrow}
              </p>

              <h2 className="text-[clamp(40px,9vw,80px)] lg:text-[clamp(56px,6vw,80px)]">
                <span
                  className={`${syne.className} block text-[#161C1B]`}
                  style={{
                    fontWeight: 700,
                    lineHeight: "0.9685",
                    letterSpacing: "-0.0653em",
                  }}
                >
                  {headA}
                </span>
                <span
                  className={`${dmSerif.className} block italic text-[#0EA766]`}
                  style={{
                    fontWeight: 400,
                    lineHeight: "0.9685",
                    letterSpacing: "-0.0403em",
                  }}
                >
                  {headB}
                </span>
              </h2>
            </div>

            <p
              className="max-w-[390px] text-[16px] leading-[1.5] text-[#66736A] sm:text-[18px] sm:leading-[27px] lg:pb-3"
              style={{ fontWeight: 400 }}
            >
              {header.description}
            </p>
          </div>
        )}

        {/* ========================= CARDS ========================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            sm:gap-6
            lg:grid-cols-3
            lg:gap-x-[clamp(20px,4vw,95px)]
            lg:gap-y-[clamp(20px,2.4vw,40px)]
          "
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="min-h-[380px] w-full animate-pulse rounded-[20px] bg-[#004530]/10 sm:min-h-[340px] sm:aspect-[425/450]"
              />
            ))
          ) : (
            <>
              {packages.map((item, i) => (
                <article key={item.id} className={CARD}>
                  <Image
                    src={
                      broken[item.id]
                        ? FALLBACK_IMAGES[i] ?? FALLBACK_IMAGES[0]
                        : item.image
                    }
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 425px, (min-width: 640px) 50vw, 100vw"
                    onError={() =>
                      setBroken((prev) => ({ ...prev, [item.id]: true }))
                    }
                    className="
                      z-0
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      will-change-transform
                      group-hover:scale-110
                    "
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[1]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)",
                    }}
                  />

                  <div className={INNER}>
                    {item.duration && (
                      <p
                        className={`mb-[2.35cqw] uppercase text-white ${EYEBROW_SIZE}`}
                        style={EYEBROW}
                      >
                        {item.duration}
                      </p>
                    )}

                    {/* right padding keeps the text clear of the circle */}
                    <h3
                      className={`${syne.className} pr-[calc(var(--c)+2.8cqw)] text-[clamp(20px,7.5cqw,32px)] text-white`}
                      style={{
                        fontWeight: 700,
                        lineHeight: "1.12",
                        letterSpacing: "-0.034em",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="mt-[2.35cqw] pr-[calc(var(--c)+2.8cqw)] text-[clamp(13px,4.7cqw,20px)] text-[#C7C7C7]"
                      style={{ fontWeight: 400, lineHeight: "1.2" }}
                    >
                      {item.prefix}{" "}
                      {item.price && (
                        <>
                          <span
                            className="text-[1.2em] text-[#A4EA6D]"
                            style={{ fontWeight: 400 }}
                          >
                            {item.price}
                          </span>{" "}
                          {item.suffix}
                        </>
                      )}
                    </p>

                    <ArrowCircle
                      href={item.href}
                      label={`${item.title}${
                        item.duration ? `, ${item.duration}` : ""
                      }`}
                      tone="glass"
                    />
                  </div>
                </article>
              ))}

              {/* ===================== CTA CARD ===================== */}
              <article className={`${CARD} bg-[#A4EA6D] !justify-between`}>
                <p
                  className={`relative z-10 p-[5.65cqw] uppercase text-[#004530] ${EYEBROW_SIZE}`}
                  style={EYEBROW}
                >
                  {cta.buttonText}
                </p>

                <div className={INNER}>
                  <h3
                    className={`${syne.className} text-[clamp(26px,9.4cqw,40px)] text-[#004530]`}
                    style={{
                      fontWeight: 700,
                      lineHeight: "1.2",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {ctaLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < ctaLines.length - 1 && <br />}
                      </span>
                    ))}
                  </h3>

                  <p
                    className="mt-[2.35cqw] pr-[calc(var(--c)+2.8cqw)] text-[clamp(13px,4.2cqw,18px)] text-[#004530]"
                    style={{ fontWeight: 400, lineHeight: "1.2" }}
                  >
                    {cta.description}
                  </p>

                  <ArrowCircle
                    href={cta.buttonLink}
                    label={FALLBACK_CTA.ariaLabel}
                    tone="lime"
                  />
                </div>
              </article>
            </>
          )}
        </div>
      </div>
    </section>
  );
}