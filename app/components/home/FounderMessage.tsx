import Image from "next/image";
import { DM_Sans, Syne } from "next/font/google";
import founderPortrait from "../../../public/images/founder-portrait.png";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700"],
});

export default function FounderMessage() {
  return (
    <section
      id="founder"
      className={`${dmSans.className} w-full bg-[#F7F8F2] px-5 py-14 text-[#171F1C] sm:px-8 sm:py-16 lg:px-[7%] lg:py-[64px]`}
    >
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-10 lg:grid-cols-[1.18fr_0.92fr] lg:gap-12 xl:gap-[58px]">
        {/* Founder message */}
        <div className="min-w-0">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.19em] text-[#27332E] sm:text-[11px]">
            04 / A note from our founder
          </p>

          <h2
            className={`${syne.className} mb-4 text-[clamp(42px,5.21vw,66px)] font-bold leading-[1.05] tracking-[-0.07em]`}
          >
            A journey built{" "}
            <span className="italic text-[#0BA66A]">on trust.</span>
          </h2>

          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00A66A]">
            Our CMD&apos;s message
          </p>

          <div className="space-y-0 text-[14px] leading-[1.85] text-[#5B6861] sm:text-[15px] lg:text-[15.5px]">
            <p>
              It is my privilege to lead Green Oasis and to be part of the
              journeys of so many people over the years.
            </p>
            <p>
              When Green Oasis began, our goal was simple: to create travel
              experiences that people could trust. As we have grown, that belief
              has remained at the heart of everything we do.
            </p>
            <p>
              Today, we see travel as something deeper than reaching a
              destination. It is an opportunity to reconnect with nature, with
              the people who matter, and with ourselves.
            </p>
            <p>
              Our responsibility is to make that journey easier, more thoughtful
              and more meaningful.
            </p>
            <p>
              We believe in listening before we plan, caring beyond the
              itinerary, and being there when it matters. Every traveller has a
              different reason for going, and we want Green Oasis to be the
              companion they can rely on along the way.
            </p>
          </div>

          <div className="mt-5">
            <p
              className={`${syne.className} text-[23px] font-semibold leading-tight tracking-[-0.045em] sm:text-[26px]`}
            >
              Jaleel Mankarathodi
            </p>
            <p className="mt-1 text-[14px] text-[#65716A] sm:text-[15px]">
              Founding Chairman &amp; Managing Director
            </p>
          </div>
        </div>

        {/* Founder portrait */}
        <div className="relative mx-auto aspect-[0.97/1] w-full max-w-[550px] overflow-hidden rounded-[28px] [border-top-right-radius:clamp(110px,14vw,190px)] lg:aspect-[0.97/1] lg:max-w-none">
          <Image
            src={founderPortrait}
            alt="Jaleel Mankarathodi, Founding Chairman and Managing Director of Green Oasis"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
