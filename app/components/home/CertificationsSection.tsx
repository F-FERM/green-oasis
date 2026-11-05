"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

const resolveImg = (path?: string) => {
  if (!path) return "";
  return /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`;
};

type ApiCert = {
  name?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
  _id?: string;
};

type CertData = {
  certificationsEyebrow?: string;
  certificationsHeading?: string;
  certificationsDescription?: string;
  certifications?: ApiCert[];
  isActive?: boolean;
};

const FALLBACK_CERTIFICATIONS = [
  { src: "/images/certifications/bni.png", alt: "BNI" },
  { src: "/images/certifications/tafi.png", alt: "TAFI" },
  { src: "/images/certifications/vittc.png", alt: "VITTC" },
  { src: "/images/certifications/iso.png", alt: "ISO" },
  { src: "/images/certifications/toai.png", alt: "TOAI" },
  { src: "/images/certifications/iata.png", alt: "IATA" },
];

/* If an API logo fails to load, use the matching local PNG */
const LOCAL_BY_NAME: Record<string, string> = {
  bni: "/images/certifications/bni.png",
  tafi: "/images/certifications/tafi.png",
  ittc: "/images/certifications/vittc.png",
  vittc: "/images/certifications/vittc.png",
  iso: "/images/certifications/iso.png",
  toai: "/images/certifications/toai.png",
  iata: "/images/certifications/iata.png",
};

const FALLBACK_HEADER = {
  eyebrow: "07 / Our certifications",
  heading: "Recognised for Trust. Committed to Excellence.",
  description:
    "Our certifications reflect our commitment to quality, reliability, and professional standards, giving you greater confidence in every journey.",
};

const splitSentences = (text: string): [string, string] => {
  const parts = (text.match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim());
  if (parts.length < 2) {
    const w = text.split(" ");
    const cut = Math.ceil(w.length / 2);
    return [w.slice(0, cut).join(" "), w.slice(cut).join(" ")];
  }
  return [parts[0], parts.slice(1).join(" ")];
};

export default function CertificationsSection() {
  const [data, setData] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: CertData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load certifications:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const apiCerts = [...(data?.certifications ?? [])]
    .filter((c) => c.isActive !== false && c.name)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const CERTIFICATIONS = apiCerts.length
    ? apiCerts.map((c) => {
        const alt = c.name as string;
        const local =
          LOCAL_BY_NAME[alt.toLowerCase()] ?? FALLBACK_CERTIFICATIONS[0].src;
        return {
          alt,
          src:
            c.image && !broken[alt] ? resolveImg(c.image) : local,
        };
      })
    : FALLBACK_CERTIFICATIONS;

  const header = {
    eyebrow: data?.certificationsEyebrow || FALLBACK_HEADER.eyebrow,
    heading: data?.certificationsHeading || FALLBACK_HEADER.heading,
    description:
      data?.certificationsDescription || FALLBACK_HEADER.description,
  };
  const [headA, headB] = splitSentences(header.heading);

  return (
    <section
      id="certifications"
      className={`${dmSans.className} w-full overflow-hidden bg-[#F7F8F1] px-4 py-14 text-black sm:px-8 sm:py-20 lg:px-12 xl:px-20`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {loading ? (
          <div
            aria-hidden="true"
            className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center lg:mb-[58px]"
          >
            <div>
              <div className="mb-3 h-[10px] w-[170px] animate-pulse rounded bg-black/10" />
              <div className="h-[clamp(36px,4.3vw,54px)] w-[min(460px,85vw)] animate-pulse rounded bg-black/10" />
              <div className="mt-2 h-[clamp(34px,4.1vw,51px)] w-[min(520px,90vw)] animate-pulse rounded bg-black/10" />
            </div>
            <div className="w-full max-w-[310px] space-y-3">
              <div className="h-3 w-full animate-pulse rounded bg-black/10" />
              <div className="h-3 w-full animate-pulse rounded bg-black/10" />
              <div className="h-3 w-[70%] animate-pulse rounded bg-black/10" />
            </div>
          </div>
        ) : (
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center lg:mb-[58px]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#111916]">
                {header.eyebrow}
              </p>

              <h2 className="leading-[1.03]">
                <span
                  className={`${syne.className} block text-[clamp(36px,4.3vw,54px)] font-bold tracking-[-0.065em]`}
                >
                  {headA}
                </span>

                <span
                  className={`${dmSerif.className} mt-1 block text-[clamp(34px,4.1vw,51px)] italic leading-[1.05] tracking-[-0.035em] text-[#0BA66A]`}
                >
                  {headB}
                </span>
              </h2>
            </div>

            <p className="max-w-[310px] pb-1 text-[13px] leading-[1.65] text-[#748078] sm:text-[14px]">
              {header.description}
            </p>
          </div>
        )}
      </div>

      {/* Full-width continuous logo animation */}
      {loading ? (
        <div
          aria-hidden="true"
          className="flex w-full items-center overflow-hidden"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-[112px] w-[clamp(190px,16.3vw,260px)] shrink-0 items-center justify-center px-7"
            >
              <div className="h-[60px] w-full animate-pulse rounded bg-black/10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="certification-marquee w-full overflow-hidden">
          <div className="certification-track flex w-max items-center">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="certification-group flex shrink-0 items-center"
                aria-hidden={group === 1}
              >
                {CERTIFICATIONS.map((item, index) => (
                  <div
                    key={`${item.alt}-${index}`}
                    className="flex h-[112px] w-[clamp(190px,16.3vw,260px)] shrink-0 items-center justify-center px-7"
                  >
                    <Image
                      src={item.src}
                      alt={group === 0 ? item.alt : ""}
                      width={220}
                      height={110}
                      sizes="(min-width: 1024px) 220px, 180px"
                      onError={() =>
                        setBroken((prev) => ({ ...prev, [item.alt]: true }))
                      }
                      className="h-full max-h-[100px] w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .certification-track {
          animation: certification-scroll 28s linear infinite;
          will-change: transform;
        }

        .certification-marquee:hover .certification-track {
          animation-play-state: paused;
        }

        @keyframes certification-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .certification-track {
            animation-duration: 24s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .certification-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}