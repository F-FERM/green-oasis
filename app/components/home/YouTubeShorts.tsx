"use client";

import { DM_Sans, DM_Serif_Display, Syne } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const VIDEOS = [
  { id: "GOozpkil-l8", title: "Green Oasis Short 1" },
  { id: "aFR_lYdnpvs", title: "Green Oasis Short 2" },
  { id: "DQM8iQqSnJo", title: "Green Oasis Short 3" },
  { id: "12mf9rAg9hs", title: "Green Oasis Short 4" },
];

export default function YouTubeShorts() {
  return (
    <section
      id="traveller-stories"
      className={`${dmSans.className} w-full bg-[#F7F8F2] px-5 py-16 text-[#111916] sm:px-8 sm:py-20 lg:px-[6.2%] lg:py-[76px]`}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-col justify-between gap-6 md:mb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#27332E]">
              06 / Travel made human
            </p>

            <h2 className="leading-[1.02]">
              <span
                className={`${syne.className} block text-[clamp(38px,4.4vw,54px)] font-bold tracking-[-0.065em]`}
              >
                Let&apos;s Hear
              </span>
              <span
                className={`${dmSerif.className} mt-1 block text-[clamp(38px,4.2vw,52px)] italic leading-[1.05] tracking-[-0.035em] text-[#0BA66A]`}
              >
                From Our Travellers
              </span>
            </h2>
          </div>

          <p className="max-w-[310px] pb-1 text-[13px] leading-[1.65] text-[#748078] sm:text-[14px]">
            Discover the experiences, unforgettable moments, and heartfelt
            stories shared by travellers who explored the world with us.
          </p>
        </div>

        {/* Four supplied Shorts, displayed in one row without slider controls. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-[17px]">
          {VIDEOS.map((video) => (
            <article
              key={video.id}
              className="relative aspect-[9/16] min-w-0 overflow-hidden rounded-[16px] bg-[#E5EAE5] sm:rounded-[20px]"
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0`}
                title={video.title}
                className="absolute inset-0 h-full w-full"
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
