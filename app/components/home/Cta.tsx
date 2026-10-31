import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

export default function Cta() {
  return (
    <section
      id="cta"
      className={`${dmSans.className} relative w-full bg-[#A4EA6D] py-14 text-center sm:py-20 xl:py-[80px] ${PAD}`}
    >
      <span id="plan" className="sr-only" />
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center">
        {/* Eyebrow */}
        <p
          className="mb-3 text-[11px] uppercase text-black sm:mb-4 sm:text-[12px]"
          style={{
            fontWeight: 700,
            lineHeight: "100%",
            letterSpacing: "2.16px",
          }}
        >
          Your next chapter starts here
        </p>

        <h2 className="text-[clamp(40px,11vw,80px)] text-[#004530]">
          <span
            className={`${syne.className} block whitespace-nowrap`}
            style={{
              fontWeight: 700,
              lineHeight: "0.97",
              letterSpacing: "-0.0424em",
            }}
          >
            Let’s go
          </span>
          <span
            className={`${syne.className} block whitespace-nowrap`}
            style={{
              fontWeight: 700,
              lineHeight: "0.97",
              letterSpacing: "-0.0424em",
            }}
          >
            somewhere
          </span>
          <span
            className={`${dmSerif.className} block whitespace-nowrap italic`}
            style={{
              fontWeight: 400,
              lineHeight: "1.17",
              letterSpacing: "-0.0485em",
            }}
          >
            that means more.
          </span>
        </h2>

        {/* Paragraph */}
        <p
          className="mt-6 max-w-[640px] text-[16px] leading-[1.6] text-[#3A3A3A] sm:mt-8 sm:text-[18px] sm:leading-[28px]"
          style={{ fontWeight: 400 }}
        >
          Tell us where you’re dreaming of going, or simply how you want to
          feel. We’ll start with a conversation.
        </p>

        {/* Button — same behaviour as the "Get to know us" button */}
        <Link
          href="#contact"
          className="
            group
            mt-6
            inline-flex
            min-h-[60px]
            max-w-full
            items-center
            justify-center
            gap-[10px]
            rounded-[50px]
            bg-[#004530]
            px-[25px]
            py-[17px]
            text-[16px]
            uppercase
            text-white
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1
            hover:bg-[#00B57E]
            hover:shadow-[0_12px_24px_rgba(0,181,126,0.25)]
            focus-visible:-translate-y-1
            focus-visible:bg-[#00B57E]
            sm:mt-7
            sm:px-[38px]
            sm:text-[18px]
          "
          style={{ fontWeight: 700, lineHeight: "100%" }}
        >
          Start a conversation
          <ArrowUpRight
            size={18}
            aria-hidden="true"
            className="
              transition-transform
              duration-300
              ease-out
              group-hover:rotate-45
              group-focus-visible:rotate-45
            "
          />
        </Link>

        {/* Placeholder note from the design — delete before publishing */}
        <p
          className="mt-5 max-w-[620px] text-[16px] leading-[1.6] text-[#3A3A3A] sm:text-[18px] sm:leading-[28px]"
          style={{ fontWeight: 400 }}
        >
          Demo enquiry link — replace with the official Green Oasis contact
          details before publishing.
        </p>
      </div>
    </section>
  );
}