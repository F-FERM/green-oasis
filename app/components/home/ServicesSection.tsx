"use client";

import { useEffect, useState } from "react";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const ENDPOINT = `${API_BASE}/home-page`;

type ApiService = {
  title?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  _id?: string;
};

type ServicesData = {
  servicesEyebrow?: string;
  servicesHeading?: string;
  servicesDescription?: string;
  services?: ApiService[];
  isActive?: boolean;
};

const FALLBACK_SERVICES = [
  {
    title: "International Tours",
    description:
      "Explore destinations around the world with thoughtfully curated international travel packages.",
  },
  {
    title: "Domestic Tours",
    description:
      "Discover India’s beautiful destinations with comfortable, well-planned travel experiences.",
  },
  {
    title: "Customized Tours",
    description:
      "Personalised itineraries designed around your interests, preferences, and travel needs.",
  },
  {
    title: "Hajj & Umrah",
    description:
      "Meaningful spiritual journeys with carefully arranged travel support and guidance.",
  },
  {
    title: "Visa Assistance",
    description:
      "Travel visa assistance to help make your international journey easier.",
  },
  {
    title: "Flight Ticket Booking",
    description:
      "Flight booking assistance for domestic and international travel.",
  },
];

const FALLBACK_HEADER = {
  eyebrow: "05 / Explore our services",
  heading: "Different journeys. One trusted companion.",
  description:
    "A good travel companion knows the details because your journey matters.",
};

/* "Different journeys. One trusted companion." -> [sans, serif] */
const splitSentences = (text: string): [string, string] => {
  const parts = (text.match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim());
  if (parts.length < 2) {
    const w = text.split(" ");
    const cut = Math.ceil(w.length / 2);
    return [w.slice(0, cut).join(" "), w.slice(cut).join(" ")];
  }
  return [parts[0], parts.slice(1).join(" ")];
};

export default function ServicesSection() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const d: ServicesData | null = json?.data ?? json ?? null;
        if (d && d.isActive !== false) setData(d);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load services:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const apiServices = [...(data?.services ?? [])]
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const SERVICES = (
    apiServices.length
      ? apiServices.map((s) => ({
          title: s.title ?? "",
          description: s.description ?? "",
        }))
      : FALLBACK_SERVICES
  ).map((s, i) => ({ ...s, number: String(i + 1).padStart(2, "0") }));

  const header = {
    eyebrow: data?.servicesEyebrow || FALLBACK_HEADER.eyebrow,
    heading: data?.servicesHeading || FALLBACK_HEADER.heading,
    description: data?.servicesDescription || FALLBACK_HEADER.description,
  };
  const [headA, headB] = splitSentences(header.heading);

  return (
    <section
      id="services"
      className={`${dmSans.className} w-full bg-[#DDF5E1] px-4 py-14 text-black sm:px-8 sm:py-20 lg:px-12 xl:px-20`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {/* Section heading */}
        {loading ? (
          <div
            aria-hidden="true"
            className="mb-9 flex flex-col justify-between gap-6 lg:mb-[38px] lg:flex-row lg:items-end"
          >
            <div>
              <div className="mb-4 h-[11px] w-[200px] animate-pulse rounded bg-black/10" />
              <div className="h-[clamp(39px,5.2vw,68px)] w-[min(520px,85vw)] animate-pulse rounded bg-black/10" />
              <div className="mt-2 h-[clamp(37px,4.7vw,64px)] w-[min(600px,90vw)] animate-pulse rounded bg-black/10" />
            </div>
            <div className="w-full max-w-[350px] space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-black/10" />
              <div className="h-4 w-[70%] animate-pulse rounded bg-black/10" />
            </div>
          </div>
        ) : (
          <div className="mb-9 flex flex-col justify-between gap-6 lg:mb-[38px] lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.19em] text-[#27332E] sm:text-[11px]">
                {header.eyebrow}
              </p>

              <h2 className="leading-[1.02]">
                <span
                  className={`${syne.className} block text-[clamp(39px,5.2vw,68px)] font-bold tracking-[-0.065em]`}
                >
                  {headA}
                </span>
                <span
                  className={`${dmSerif.className} mt-1 block text-[clamp(37px,4.7vw,64px)] italic leading-[1.05] tracking-[-0.035em] text-[#004530]`}
                >
                  {headB}
                </span>
              </h2>
            </div>

            <p className="max-w-[350px] pb-1 text-[14px] leading-[1.7] text-[#75827A] sm:text-[15px] lg:mb-1">
              {header.description}
            </p>
          </div>
        )}

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-[17px] sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="flex min-h-[205px] flex-col items-start rounded-[13px] bg-white px-[30px] py-[30px] sm:px-[38px] sm:py-[34px]"
                >
                  <div className="h-[10px] w-[30px] animate-pulse rounded bg-black/10" />
                  <div className="mt-[27px] h-[22px] w-[60%] animate-pulse rounded bg-black/10" />
                  <div className="mt-[24px] h-[14px] w-full animate-pulse rounded bg-black/10" />
                  <div className="mt-2 h-[14px] w-[75%] animate-pulse rounded bg-black/10" />
                </div>
              ))
            : SERVICES.map((service) => (
                <article
                  key={service.number}
                  className="group flex min-h-[205px] flex-col items-start rounded-[13px] bg-white px-[30px] py-[30px] transition-colors duration-300 ease-out hover:bg-[#A4EA6D] sm:min-h-[205px] sm:px-[38px] sm:py-[34px]"
                >
                  <span className="text-[10px] font-medium leading-none tracking-[0.02em] text-[#84988B] transition-colors duration-300 group-hover:text-[#426C42]">
                    {service.number} /
                  </span>

                  <h3
                    className={`${syne.className} mt-[27px] text-[20px] font-bold leading-[1.25] tracking-[-0.055em] text-[#1B2420] transition-colors duration-300 group-hover:text-[#004530] sm:text-[21px]`}
                  >
                    {service.title}
                  </h3>

                  <p className="mt-[24px] max-w-[390px] text-[14px] leading-[1.5] text-[#68756D] transition-colors duration-300 group-hover:text-[#31563B] sm:text-[14.5px]">
                    {service.description}
                  </p>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}