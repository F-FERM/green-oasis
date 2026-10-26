import { DM_Sans, Syne, DM_Serif_Display } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const syne = Syne({ subsets: ["latin"], weight: ["700"] });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const STEPS = [
  {
    title: "Tell us what matters",
    text: "Share your travel hopes, preferences and who you’re travelling with.",
  },
  {
    title: "We listen & plan",
    text: "We thoughtfully shape the journey around your needs.",
  },
  {
    title: "Get ready to go",
    text: "Review the arrangements and feel confident before setting off.",
  },
  {
    title: "Travel with care",
    text: "Stay connected through the agreed stages of your journey.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className={`
        ${dmSans.className}
        w-full
        bg-[#F8F8F3]
        py-14
        sm:py-20
        lg:py-24
        xl:pb-[140px]
        xl:pt-[120px]
        ${PAD}
      `}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {/* ========================= HEADER ========================= */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <p
              className="mb-4 text-[11px] uppercase text-[#161C1B] sm:mb-5 sm:text-[12px]"
              style={{
                fontWeight: 700,
                lineHeight: "100%",
                letterSpacing: "2.16px",
              }}
            >
              06 / How it works
            </p>

            <h2 className="text-[clamp(38px,10.5vw,80px)] lg:text-[clamp(52px,5.2vw,80px)]">
              <span
                className={`${syne.className} block whitespace-nowrap text-[#161C1B]`}
                style={{
                  fontWeight: 700,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.04em",
                }}
              >
                From first hello
              </span>
              <span
                className={`${dmSerif.className} block whitespace-nowrap italic text-[#0EA766]`}
                style={{
                  fontWeight: 400,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.04em",
                }}
              >
                to welcome home.
              </span>
            </h2>
          </div>

          <p
            className="max-w-[390px] text-[16px] leading-[1.55] text-[#66736A] sm:text-[18px] sm:leading-[28px] lg:pb-3"
            style={{ fontWeight: 400 }}
          >
            Simple, thoughtful planning that leaves more room for the
            experience itself.
          </p>
        </div>

        {/* ========================= STEPS =========================
            */}
        <ol
          className="
            mt-10
            grid
            grid-cols-1
            gap-x-[21px]
            gap-y-10
            sm:mt-12
            sm:grid-cols-2
            lg:mt-14
            lg:grid-cols-4
          "
        >
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="border-t border-[#161C1B]/40 pt-6 sm:pt-7"
            >
              <span
                aria-hidden="true"
                className={`${syne.className} block text-[40px] text-[#0EA766] sm:text-[44px] lg:text-[clamp(38px,3.4vw,50px)]`}
                style={{ fontWeight: 700, lineHeight: "100%" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3
                className={`${syne.className} mt-4 text-[22px] text-[#161C1B] sm:mt-5 sm:text-[24px] lg:text-[clamp(20px,1.9vw,28px)]`}
                style={{ fontWeight: 700, lineHeight: "100%" }}
              >
                {step.title}
              </h3>

              <p
                className="mt-4 max-w-[360px] text-[16px] text-[#657167] sm:mt-5 lg:text-[clamp(14px,1.25vw,18px)] sm:text-[17px]"
                style={{ fontWeight: 400, lineHeight: "1.322" }}
              >
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}