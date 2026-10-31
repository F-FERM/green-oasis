import Image from "next/image";
import founderImg from "../../../public/images/journey.png";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const EYEBROW = {
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "2.16px",
} as const;

const MESSAGE = [
  "It is my privilege to lead Green Oasis and to be part of the journeys of so many people over the years.",
  "When Green Oasis began, our goal was simple: to create travel experiences that people could trust. As we have grown, that belief has remained at the heart of everything we do.",
  "Today, we see travel as something deeper than reaching a destination. It is an opportunity to reconnect with nature, with the people who matter, and with ourselves.",
  "Our responsibility is to make that journey easier, more thoughtful and more meaningful.",
  "We believe in listening before we plan, caring beyond the itinerary, and being there when it matters. Every traveller has a different reason for going, and we want Green Oasis to be the companion they can rely on along the way.",
];

export default function Founder() {
  return (
    <section
      id="founder"
      className={`${dmSans.className} w-full bg-[#F7F7F3] py-14 sm:py-20 xl:py-[90px] ${PAD}`}
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1465px]
          grid-cols-1
          items-start
          gap-10
          lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)]
          lg:gap-[clamp(24px,2.6vw,38px)]
        "
      >
        {/* ========================= TEXT =========================
             */}
        <div className="min-w-0 [container-type:inline-size]">
          <p
            className="mb-4 text-[11px] uppercase text-[#161C1B] sm:mb-[22px] sm:text-[12px]"
            style={EYEBROW}
          >
            04 / A note from our founder
          </p>

          <h2
            className="
              text-[clamp(36px,11cqw,60px)]
              sm:whitespace-nowrap
              sm:text-[clamp(36px,9.6cqw,80px)]
            "
            style={{ lineHeight: "1.05" }}
          >
            <span
              className={`${syne.className} text-[#161C1B]`}
              style={{ fontWeight: 700, letterSpacing: "-0.07em" }}
            >
              A journey built
            </span>{" "}
            <span
              className={`${dmSerif.className} italic text-[#0EA766]`}
              style={{ fontWeight: 400, letterSpacing: "-0.045em" }}
            >
              on trust.
            </span>
          </h2>

          <p
            className="mb-5 mt-3 text-[11px] uppercase text-[#0EA766] sm:mb-7 sm:text-[12px]"
            style={EYEBROW}
          >
            Our CMD’s message
          </p>

          <div
            className="max-w-[680px] text-[16px] leading-[1.6] text-[#536158] sm:text-[18px] sm:leading-[28.9px]"
            style={{ fontWeight: 400 }}
          >
            {MESSAGE.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {/* Signature */}
          <div className="mt-5 sm:mt-6">
            <p
              className={`${syne.className} text-[26px] text-[#161C1B] sm:text-[32px]`}
              style={{ fontWeight: 700, lineHeight: "100%" }}
            >
              Jaleel Mankarathodi
            </p>
            <p
              className="mt-1 text-[16px] leading-[1.6] text-[#536158] sm:text-[18px] sm:leading-[28.9px]"
              style={{ fontWeight: 400 }}
            >
              Founding Chairman &amp; Managing Director
            </p>
          </div>
        </div>

        {/* ========================= PHOTO ========================= */}
        <div
          className="
            relative
            mx-auto
            aspect-[615/634]
            w-full
            max-w-[520px]
            overflow-hidden
            rounded-bl-[24px]
            rounded-br-[24px]
            rounded-tl-[24px]
            rounded-tr-[44%]
            sm:rounded-bl-[30px]
            sm:rounded-br-[30px]
            sm:rounded-tl-[30px]
            lg:mx-0
            lg:max-w-none
          "
        >
          <Image
            src={founderImg}
            alt="Jaleel Mankarathodi, Founding Chairman and Managing Director of Green Oasis"
            fill
            sizes="(min-width: 1024px) 615px, (min-width: 640px) 520px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}