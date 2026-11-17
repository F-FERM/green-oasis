"use client";

import Image from "next/image";
import { CalendarDays, Clock3, MapPin } from "lucide-react";

import heroLogo from "../../../public/images/hero-logo.png";
import { syne, dmSans } from "@/app/fonts";

export default function YathraHero() {
  return (
    <section
      id="hero"
      className={`relative isolate w-full overflow-hidden bg-[#FFF8F3] ${dmSans.className} xl:aspect-[3.54/1] xl:min-h-0`}
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

      {/* Soft background overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#FFF8F3]/65 via-[#FFF8F3]/20 to-transparent" />

      {/* Green Oasis Logo */}
      <div className="absolute left-5 top-5 z-30 sm:left-8 sm:top-8 xl:left-[4.5%] xl:top-[9%]">
        <Image
          src={heroLogo}
          alt="Green Oasis"
          priority
          className="h-auto w-[115px] sm:w-[145px] xl:w-[160px]"
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative mx-auto flex w-full max-w-[1800px] flex-col px-5 pb-0 pt-[125px] sm:px-8 sm:pt-[150px] xl:h-full xl:flex-row xl:items-start xl:px-[4.5%] xl:pb-0 xl:pt-0">
        {/* Yathra Vismayam Logo */}
        <div
          className="
            relative z-10 flex w-full items-center justify-center
            xl:absolute xl:bottom-[8%] xl:left-[4.5%]
            xl:w-[31%] xl:justify-start
          "
        >
          <Image
            src="/images/yathra-logo.png"
            alt="Yathra Vismayam"
            width={1768}
            height={797}
            priority
            sizes="(max-width: 640px) 85vw, (max-width: 1279px) 75vw, 31vw"
            className="h-auto w-[min(85%,420px)] object-contain sm:w-[min(75%,480px)] xl:w-full"
          />
        </div>

        {/* Event Information Card */}
        <div
          className="
            relative z-20 mx-auto mt-8 w-full max-w-[613px]
            rounded-[24px] border border-[#D4D4D4]
            bg-[#E8E8E8]/[0.33]
            px-5 py-6
            shadow-[0_8px_35px_rgba(0,69,48,0.035)]
            backdrop-blur-[4px]

            sm:px-8

            xl:absolute xl:left-[40.5%] xl:top-[13.8%]
            xl:mx-0 xl:mt-0
            xl:w-[32.5%] xl:max-w-[613px]
            xl:rounded-[30px]
            xl:px-[clamp(20px,2.1vw,40px)]
            xl:py-[clamp(12px,0.9vw,17px)]
          "
        >
          {/* Heading */}
          <h1
            className={`
              ${syne.className}
              text-[clamp(23px,3.05vw,35px)]
              font-bold leading-[1.08]
              tracking-[-0.075em]
              text-[#004530]

              xl:text-[clamp(22px,1.84vw,35px)]
              xl:leading-[1]
            `}
          >
            KERALA&apos;S LARGEST
            <br />
            CURATED TRAVEL EXPO
          </h1>

          {/* Event Details */}
          <div
            className="
              mt-4 grid grid-cols-1 gap-3
              sm:grid-cols-3 sm:gap-0
              xl:mt-[clamp(10px,0.65vw,13px)]
              xl:grid-cols-[1.12fr_1fr_1.1fr]
            "
          >
            {/* Date */}
            <div
              className="
                flex items-center gap-3
                sm:border-r sm:border-[#004530]/50
                sm:pr-4
                xl:gap-[clamp(7px,0.65vw,12px)]
                xl:pr-[clamp(8px,0.9vw,17px)]
              "
            >
              <CalendarDays
                className="h-[22px] w-[22px] shrink-0 text-[#004530] xl:h-[clamp(17px,1.15vw,22px)] xl:w-[clamp(17px,1.15vw,22px)]"
                strokeWidth={2.3}
              />

              <p className="text-[15px] font-medium leading-[1.3] text-[#004530] sm:text-[17px] xl:text-[clamp(12px,0.95vw,18px)]">
                November
                <br />
                28 &amp; 29, 2026
              </p>
            </div>

            {/* Time */}
            <div
              className="
                flex items-center gap-3
                sm:justify-center
                sm:border-r sm:border-[#004530]/50
                sm:px-4
                xl:gap-[clamp(7px,0.65vw,12px)]
                xl:px-[clamp(8px,0.9vw,17px)]
              "
            >
              <Clock3
                className="h-[23px] w-[23px] shrink-0 text-[#004530] xl:h-[clamp(18px,1.2vw,23px)] xl:w-[clamp(18px,1.2vw,23px)]"
                strokeWidth={2.3}
              />

              <p className="text-[15px] font-medium leading-[1.3] text-[#004530] sm:text-[17px] xl:text-[clamp(12px,0.95vw,18px)]">
                10:00 AM -
                <br />
                06:00 PM
              </p>
            </div>

            {/* Location */}
            <div
              className="
                flex items-center gap-3
                sm:justify-end sm:pl-4
                xl:gap-[clamp(7px,0.65vw,12px)]
                xl:pl-[clamp(8px,0.9vw,17px)]
              "
            >
              <MapPin
                className="h-[23px] w-[23px] shrink-0 text-[#004530] xl:h-[clamp(18px,1.2vw,23px)] xl:w-[clamp(18px,1.2vw,23px)]"
                strokeWidth={2.3}
              />

              <p className="text-[15px] font-medium leading-[1.3] text-[#004530] sm:text-[17px] xl:text-[clamp(12px,0.95vw,18px)]">
                IMA House,
                <br />
                Kochi
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className={`
              ${dmSans.className}
              mt-4 text-[14px] font-normal
              leading-[1.6] tracking-normal
              text-[#4B4B4B]
              sm:text-[16px]
              xl:mt-[clamp(10px,0.65vw,13px)]
              xl:text-[clamp(12px,0.95vw,18px)]
              xl:leading-[1.6]
            `}
          >
            Discover exclusive travel packages, special holiday offers, and
            inspiring travel experiences.
          </p>
        </div>

        {/* Presenter Image */}
        <div
          className="
            relative z-10 mt-5 ml-auto
            w-[min(75%,320px)]
            sm:w-[min(65%,360px)]

            xl:absolute xl:bottom-0 xl:right-[1%]
            xl:mt-0 xl:ml-0
            xl:w-[27%]
          "
        >
          <Image
            src="/images/yathra-presenter.png"
            alt="Yathra Travel Expo presenter"
            width={1920}
            height={2008}
            priority
            sizes="(max-width: 640px) 75vw, (max-width: 1279px) 65vw, 27vw"
            className="h-auto w-full object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
