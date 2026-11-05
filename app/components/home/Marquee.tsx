"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import starImg from "../../../public/images/charm_north-star.png";
import { dmSans } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";

const FALLBACK_ITEMS = [
  "Travel for you",
  "Return with more",
  "People before packages",
  "Journeys that mean more",
];

const GROUPS = [0, 1, 2, 3, 4, 5];

/* Skeleton widths approximating real text widths */
const SKELETON_WIDTHS = [
  "w-[100px] sm:w-[130px] lg:w-[160px]",
  "w-[110px] sm:w-[145px] lg:w-[175px]",
  "w-[150px] sm:w-[195px] lg:w-[240px]",
  "w-[150px] sm:w-[190px] lg:w-[235px]",
];

function Item({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-[8px] sm:gap-[12px]">
      <span
        className="whitespace-nowrap text-[12px] uppercase sm:text-[15px] lg:text-[18px]"
        style={{ fontWeight: 800, lineHeight: "100%" }}
      >
        {text}
      </span>
      <Image
        src={starImg}
        alt=""
        aria-hidden="true"
        className="h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5 lg:h-6 lg:w-6"
      />
    </li>
  );
}

/* Same height as a real item (star icon height) so there's no layout shift */
function SkeletonItem({ width }: { width: string }) {
  return (
    <li className="flex items-center gap-[8px] sm:gap-[12px]">
      <span
        className={`block h-[12px] animate-pulse rounded bg-[#004530]/20 sm:h-[15px] lg:h-[18px] ${width}`}
      />
      <span className="block h-4 w-4 shrink-0 animate-pulse rounded-full bg-[#004530]/20 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
    </li>
  );
}

export default function Marquee() {
  const [items, setItems] = useState<string[]>(FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMarquee = async () => {
      try {
        const res = await fetch(`${API_BASE}/home-hero`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data = json?.data ?? json;

        if (
          data?.isActive !== false &&
          Array.isArray(data?.marqueeTexts) &&
          data.marqueeTexts.length > 0
        ) {
          setItems(data.marqueeTexts);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load marquee:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchMarquee();
    return () => controller.abort();
  }, []);

  return (
    <section
      aria-label="Our promise"
      className={`
        ${dmSans.className}
        relative w-full overflow-hidden
        bg-[#A4EA6D] py-[17px] text-[#004530]
      `}
    >
      {loading ? (
        /* Skeleton */
        <ul
          aria-hidden="true"
          className="flex w-max items-center gap-[12px] pr-[30px] sm:gap-[17px] lg:pr-[50px]"
        >
          {[...SKELETON_WIDTHS, ...SKELETON_WIDTHS].map((w, i) => (
            <SkeletonItem key={i} width={w} />
          ))}
        </ul>
      ) : (
        <>
          <style>{`
            @keyframes ticker-scroll {
              from { transform: translate3d(0, 0, 0); }
              to   { transform: translate3d(-16.6667%, 0, 0); }
            }
          `}</style>

          {/* Normal slow marquee */}
          <div className="flex w-max animate-[ticker-scroll_10s_linear_infinite] items-center will-change-transform motion-reduce:animate-none">
            {GROUPS.map((g) => (
              <ul
                key={g}
                aria-hidden={g > 0}
                className="flex shrink-0 items-center gap-[12px] pr-[30px] sm:gap-[17px] lg:pr-[50px]"
              >
                {items.map((text, i) => (
                  <Item key={`${text}-${i}`} text={text} />
                ))}
              </ul>
            ))}
          </div>
        </>
      )}
    </section>
  );
}