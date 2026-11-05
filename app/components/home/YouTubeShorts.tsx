"use client";

import { useEffect, useState } from "react";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

type ShortsData = {
  travellersEyebrow?: string;
  travellersHeading?: string;
  travellersDescription?: string;
  youtubeShorts?: unknown[];
  isActive?: boolean;
};

const FALLBACK_VIDEOS = [
  { id: "GOozpkil-l8", title: "Green Oasis Short 1" },
  { id: "aFR_lYdnpvs", title: "Green Oasis Short 2" },
  { id: "DQM8iQqSnJo", title: "Green Oasis Short 3" },
  { id: "12mf9rAg9hs", title: "Green Oasis Short 4" },
];

const FALLBACK_HEADER = {
  eyebrow: "06 / Travel made human",
  heading: "Let’s Hear From Our Travellers",
  description:
    "Discover the experiences, unforgettable moments, and heartfelt stories shared by travellers who explored the world with us.",
};

/* Accepts an id, a YouTube/Shorts URL, or an object holding either */
const extractId = (item: unknown): string | null => {
  const raw =
    typeof item === "string"
      ? item
      : item && typeof item === "object"
      ? ((item as Record<string, unknown>).videoId ??
          (item as Record<string, unknown>).id ??
          (item as Record<string, unknown>).url ??
          (item as Record<string, unknown>).youtubeUrl ??
          (item as Record<string, unknown>).link)
      : null;

  if (typeof raw !== "string" || !raw) return null;
  const m = raw.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(raw) ? raw : null;
};

/* "Let’s Hear From Our Travellers" -> ["Let’s Hear", "From Our Travellers"] */
const splitHeading = (text: string): [string, string] => {
  const w = text.split(" ");
  return [w.slice(0, 2).join(" "), w.slice(2).join(" ")];
};

export default function YouTubeShorts() {
  const [data, setData] = useState<ShortsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: ShortsData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load shorts:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const apiVideos = (data?.youtubeShorts ?? [])
    .map((item, i) => {
      const id = extractId(item);
      return id ? { id, title: `Green Oasis Short ${i + 1}` } : null;
    })
    .filter((v): v is { id: string; title: string } => v !== null);

  /* API array is empty right now -> current videos stay */
  const VIDEOS = apiVideos.length ? apiVideos : FALLBACK_VIDEOS;

  const header = {
    eyebrow: data?.travellersEyebrow || FALLBACK_HEADER.eyebrow,
    heading: data?.travellersHeading || FALLBACK_HEADER.heading,
    description: data?.travellersDescription || FALLBACK_HEADER.description,
  };
  const [headA, headB] = splitHeading(header.heading);

  return (
    <section
      id="traveller-stories"
      className={`${dmSans.className} w-full bg-[#F7F8F2] px-4 py-14 text-black sm:px-8 sm:py-20 lg:px-12 xl:px-20`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {loading ? (
          <div
            aria-hidden="true"
            className="mb-8 flex flex-col justify-between gap-6 md:items-end lg:mb-8 md:flex-row"
          >
            <div>
              <div className="mb-3 h-[10px] w-[190px] animate-pulse rounded bg-black/10" />
              <div className="h-[clamp(38px,4.4vw,54px)] w-[min(300px,70vw)] animate-pulse rounded bg-black/10" />
              <div className="mt-2 h-[clamp(38px,4.2vw,52px)] w-[min(420px,85vw)] animate-pulse rounded bg-black/10" />
            </div>
            <div className="w-full max-w-[310px] space-y-3">
              <div className="h-3 w-full animate-pulse rounded bg-black/10" />
              <div className="h-3 w-[80%] animate-pulse rounded bg-black/10" />
            </div>
          </div>
        ) : (
          <div className="mb-8 flex flex-col justify-between gap-6 md:items-end lg:mb-8 md:flex-row">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#27332E]">
                {header.eyebrow}
              </p>

              <h2 className="leading-[1.02]">
                <span
                  className={`${syne.className} block text-[clamp(38px,4.4vw,54px)] font-bold tracking-[-0.065em]`}
                >
                  {headA}
                </span>
                <span
                  className={`${dmSerif.className} mt-1 block text-[clamp(38px,4.2vw,52px)] italic leading-[1.05] tracking-[-0.035em] text-[#0BA66A]`}
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

        {/* YouTube Shorts */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-[17px]">
          {loading
            ? FALLBACK_VIDEOS.map((v) => (
                <div
                  key={v.id}
                  aria-hidden="true"
                  className="aspect-[9/16] min-w-0 animate-pulse rounded-[16px] bg-[#E5EAE5] sm:rounded-[20px]"
                />
              ))
            : VIDEOS.map((video) => (
                <article
                  key={video.id}
                  className="relative aspect-[9/16] min-w-0 overflow-hidden rounded-[16px] bg-[#E5EAE5] sm:rounded-[20px]"
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0`}
                    title={video.title}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}