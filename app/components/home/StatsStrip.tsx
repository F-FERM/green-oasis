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
      className="flex min-h-[116px] w-full items-center bg-[#004530] px-5"
    >
      <div className="mx-auto grid w-full max-w-[1112px] grid-cols-4 items-center">
        {loading
          ? FALLBACK_STATS.map((s) => (
              <div
                key={s.label}
                aria-hidden="true"
                className="flex min-w-0 flex-col items-center justify-center"
              >
                <div className="h-[clamp(22px,3.3vw,38px)] w-[clamp(50px,7vw,110px)] animate-pulse rounded bg-white/15" />
                <div className="mt-[8px] h-[10px] w-[clamp(50px,8vw,120px)] animate-pulse rounded bg-white/15" />
              </div>
            ))
          : STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-0 flex-col items-center justify-center text-center text-white"
              >
                <p
                  className={`${syne.className} whitespace-nowrap text-[clamp(22px,3.3vw,38px)] font-normal leading-[1] tracking-[-0.055em]`}
                >
                  {stat.value}
                  <span className="ml-[1px] text-[0.58em] tracking-[-0.035em]">
                    {stat.suffix}
                  </span>
                </p>

                <p
                  className={`${dmSerif.className} mt-[5px] whitespace-nowrap text-[10px] font-normal italic leading-[1.1] text-white/80`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
      </div>
    </section>
  );
}