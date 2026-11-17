"use client";

import Image from "next/image";
import { CalendarDays, Clock3, MapPin } from "lucide-react";

import heroLogo from "../../../public/images/hero-logo.png";
import { syne, dmSans } from "@/app/fonts";

export default function YathraHero() {
  return (
    <section
      id="hero"
      className={`relative isolate min-h-[540px] w-full overflow-hidden bg-[#FFF8F3] sm:min-h-[600px] lg:min-h-0 lg:h-[min(43vw,620px)] ${dmSans.className}`}
    >
      {/* Kerala landscape background */}
      <Image
        src="/images/yathra-kerala-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-center"
      />

      {/* Soft overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#FFF8F3]/80 via-[#FFF8F3]/30 to-transparent" />

      {/* Green Oasis logo */}
      <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8 lg:left-[4.5%] lg:top-[9%]">
        <Image
          src={heroLogo}
          alt="Green Oasis"
          priority
          className="h-auto w-[115px] sm:w-[145px] lg:w-[160px]"
        />
      </div>

      {/* Main content */}
      <div className="relative mx-auto flex min-h-[540px] max-w-[1800px] flex-col px-5 pb-8 pt-[125px] sm:min-h-[600px] sm:px-8 sm:pt-[150px] lg:min-h-0 lg:h-full lg:flex-row lg:items-start lg:px-[4.5%] lg:pb-0 lg:pt-0">
        {/* Yathra Logo */}
        <div className="relative z-10 flex w-full items-center justify-center lg:absolute lg:bottom-[8%] lg:left-[4.5%] lg:w-[34%] lg:justify-start">
          <Image
            src="/images/yathra-logo.png"
            alt="Yathra Vismayam"
            width={1768}
            height={797}
            priority
            className="h-auto w-[min(85%,420px)] object-contain sm:w-[min(75%,480px)] lg:w-full"
          />
        </div>

        {/* Event information card */}

        {/* Event Information Card */}
        <div
          className="
    relative z-20 mx-auto mt-8 w-full
    max-w-[613px]
    rounded-[30px]
    border border-[#D4D4D4]
    bg-[#E8E8E8]/[0.33]
    px-5 py-6
    shadow-[0_8px_35px_rgba(0,69,48,0.035)]
    backdrop-blur-[4px]
    sm:px-8
    lg:absolute lg:left-[40.5%] lg:top-[76px]
    lg:mx-0 lg:mt-0
    lg:min-h-[238px]
    lg:w-[min(613px,55%)]
    lg:px-[40px] lg:py-[17px]
  "
        >
          {/* Heading */}
          <h1
            className={`${syne.className} text-[clamp(23px,3.05vw,35px)] font-bold leading-[1.08] tracking-[-0.075em] text-[#004530]`}
          >
            KERALA&apos;S LARGEST
            <br />
            CURATED TRAVEL EXPO
          </h1>

          {/* Event Details */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
            {/* Date */}
            <div className="flex items-center gap-3 sm:border-r sm:border-[#004530]/50 sm:pr-5">
              <CalendarDays
                className="h-[25px] w-[25px] shrink-0 text-[#004530]"
                strokeWidth={2.3}
              />

              <p className="text-[15px] font-medium leading-[1.3] text-[#004530] sm:text-[17px] lg:text-[22px]">
                November
                <br />
                28 &amp; 29, 2026
              </p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 sm:justify-center sm:border-r sm:border-[#004530]/50 sm:px-5">
              <Clock3
                className="h-[27px] w-[27px] shrink-0 text-[#004530]"
                strokeWidth={2.3}
              />

              <p className="text-[15px] font-medium leading-[1.3] text-[#004530] sm:text-[17px] lg:text-[22px]">
                10:00 AM -
                <br />
                06:00 PM
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 sm:justify-end sm:pl-5">
              <MapPin
                className="h-[27px] w-[27px] shrink-0 text-[#004530]"
                strokeWidth={2.3}
              />

              <p className="text-[15px] font-medium leading-[1.3] text-[#004530] sm:text-[17px] lg:text-[22px]">
                IMA House,
                <br />
                Kochi
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className={`${dmSans.className} mt-4 text-[14px] font-normal leading-[1.6] tracking-normal text-[#4B4B4B] sm:text-[16px] lg:text-[18px]`}
          >
            Discover exclusive travel packages, special holiday offers, and
            inspiring travel experiences.
          </p>
        </div>

        {/* Presenter image */}
        <div className="pointer-events-none absolute bottom-0 right-[-5%] z-10 w-[55%] sm:right-[-2%] sm:w-[48%] lg:right-[1%] lg:w-[33%]">
          <Image
            src="/images/yathra-presenter.png"
            alt="Yathra Travel Expo presenter"
            width={1920}
            height={2008}
            priority
            sizes="(max-width: 640px) 55vw, (max-width: 1024px) 48vw, 33vw"
            className="h-auto w-full object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
