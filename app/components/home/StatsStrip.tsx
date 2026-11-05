"use client";

import { useEffect, useState } from "react";
import { syne, dmSerif } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

type ApiStat = { value?: string; label?: string; _id?: string };
type StatsData = { stats?: ApiStat[]; isActive?: boolean };

const FALLBACK_STATS = [
  { value: "150,000", suffix: "+", label: "Happy Travellers" },
  { value: "60", suffix: "+", label: "Unique Tour Packages" },
  { value: "16", suffix: "+", label: "Years of Experience" },
  { value: "98", suffix: "%", label: "Repeat Booking Rate" },
];

/* "150,000+" -> { value: "150,000", suffix: "+" }   "98%" -> { "98", "%" } */
const splitValue = (raw = "") => {
  const m = raw.trim().match(/^(.*?)([^\d,.\s]*)$/);
  return { value: m?.[1] ?? raw, suffix: m?.[2] ?? "" };
};

export default function StatsStrip() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: StatsData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load stats:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const STATS = data?.stats?.length
    ? data.stats.map((s) => ({
        ...splitValue(s.value),
        label: s.label ?? "",
      }))
    : FALLBACK_STATS;

  return (
    <section
      aria-label="Green Oasis statistics"
      className="flex w-full items-center bg-[#004530] px-4 py-8 sm:min-h-[116px] sm:px-6 sm:py-6 lg:px-5 lg:py-0"
    >
      {/* 2 columns on phones, 4 columns from 640px up */}
      <div className="mx-auto grid w-full max-w-[1112px] grid-cols-2 items-start gap-x-4 gap-y-8 sm:grid-cols-4 sm:items-center sm:gap-x-4 sm:gap-y-0">
        {loading
          ? FALLBACK_STATS.map((s) => (
              <div
                key={s.label}
                aria-hidden="true"
                className="flex min-w-0 flex-col items-center justify-center"
              >
                <div className="h-[clamp(26px,7vw,38px)] w-[clamp(70px,22vw,110px)] animate-pulse rounded bg-white/15 sm:h-[clamp(22px,3.3vw,38px)] sm:w-[clamp(50px,7vw,110px)]" />
                <div className="mt-2 h-[10px] w-[clamp(70px,26vw,120px)] animate-pulse rounded bg-white/15 sm:w-[clamp(50px,8vw,120px)]" />
              </div>
            ))
          : STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-0 flex-col items-center justify-center text-center text-white"
              >
                <p
                  className={`${syne.className} whitespace-nowrap text-[clamp(26px,8vw,40px)] font-normal leading-none tracking-[-0.055em] sm:text-[clamp(22px,3.6vw,40px)]`}
                >
                  {stat.value}
                  <span className="ml-[1px] text-[0.58em] tracking-[-0.035em]">
                    {stat.suffix}
                  </span>
                </p>

                {/* label may wrap on small screens instead of overflowing */}
                <p
                  className={`${dmSerif.className} mt-1.5 max-w-full text-balance text-[12px] font-normal italic leading-[1.2] text-white/80 sm:mt-[5px] sm:text-[clamp(10px,1.3vw,13px)] sm:leading-[1.1]`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
      </div>
    </section>
  );
}