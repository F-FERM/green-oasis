"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import discover1 from "../../../public/images/discover1.jpg";
import discover2 from "../../../public/images/discover2.jpg";
import discover3 from "../../../public/images/discover3.jpg";
import discover4 from "../../../public/images/discover4.jpg";
import { dmSans, syne, dmSerif } from "@/app/fonts";

/* Same side padding as the other sections */
const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const EYEBROW = {
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "2.16px",
} as const;

/* Each tab = one image + one block of text. Edit the copy here. */
const TABS = [
  {
    label: "Nature & Slow Travel",
    title: "Find room to breathe.",
    text: "Quiet mornings, winding trails, and the kind of stillness that stays with you long after you return.",
    image: discover1,
    alt: "Pine trees below a sunlit granite cliff",
  },
  {
    label: "Culture & Discovery",
    title: "See the world differently.",
    text: "Meet the people, stories and traditions that make every place more than a pin on a map.",
    image: discover2,
    alt: "Traveller exploring a historic old town",
  },
  {
    label: "Rest & Togetherness",
    title: "Make time for each other.",
    text: "Shared meals, slow afternoons and moments that become stories you tell for years.",
    image: discover3,
    alt: "Friends relaxing together by the water",
  },
  {
    label: "Journeys of Faith",
    title: "Travel with purpose",
    text: "Thoughtfully considered journeys of faith, reflection and meaningful connection.",
    image: discover4,
    alt: "Pilgrims gathered at a place of worship",
  },
];

export default function Discover() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="discover"
      className={`${dmSans.className} w-full bg-[#004530] py-14 text-white sm:py-20 ${PAD}`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {/* ========================= HEADER ========================= */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <p
              className="mb-4 text-[11px] uppercase text-white sm:mb-5 sm:text-[12px]"
              style={EYEBROW}
            >
              03 / Discover what moves you
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
                Follow the feeling.
              </span>
              <span
                className={`${dmSerif.className} block italic text-[#A4EA6D]`}
                style={{
                  fontWeight: 400,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.04em",
                }}
              >
                We’ll find the place.
              </span>
            </h2>
          </div>

          <p
            className="max-w-[390px] text-[16px] leading-[1.5] text-[#E8E8E8] sm:text-[18px] sm:leading-[27px] lg:pb-3"
            style={{ fontWeight: 400 }}
          >
            From unhurried escapes to meaningful journeys of faith, find a way
            to travel that feels right for you.
          </p>
        </div>

        {/* ========================== TABS ========================== */}
        <div
          role="tablist"
          aria-label="Travel experiences"
          className="mt-8 flex flex-wrap gap-3 sm:mt-9"
        >
          {TABS.map((tab, i) => {
            const selected = i === active;
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

        {/* ========================= CONTENT =========================
            Image 870 : text 517 on desktop, stacked on phones/tablets */}
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
                alt={i === active ? tab.alt : ""}
                aria-hidden={i !== active}
                fill
                sizes="(min-width: 1024px) 870px, 100vw"
                priority={i === 0}
                className={`
                  object-cover
                  transition-opacity
                  duration-500
                  ease-out
                  ${i === active ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>

          {/* ---------- Text (all stacked in one grid cell) ---------- */}
          <div className="grid min-w-0">
            {TABS.map((tab, i) => {
              const selected = i === active;
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
                    href="#cta"
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
                    Plan your journey
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
      </div>
    </section>
  );
}