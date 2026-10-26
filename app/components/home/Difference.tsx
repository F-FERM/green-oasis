import Image from "next/image";
import { DM_Sans, Syne, DM_Serif_Display } from "next/font/google";
import icon1 from "../../../public/images/icon1.png";
import icon2 from "../../../public/images/icon2.png";
import icon3 from "../../../public/images/icon3.png";
import icon4 from "../../../public/images/icon4.png";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const syne = Syne({ subsets: ["latin"], weight: ["700"] });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const POINTS = [
  {
    icon: icon1,
    title: "We listen first.",
    text: "Every thoughtful recommendation begins with understanding what matters to you.",
  },
  {
    icon: icon2,
    title: "Made personal.",
    text: "We shape experiences around people, not standard itineraries.",
  },
  {
    icon: icon3,
    title: "Honest, always.",
    text: "Clear communication and realistic expectations at every step.",
  },
  {
    icon: icon4,
    title: "Care that stays.",
    text: "Support that goes beyond bookings and the itinerary.",
  },
];

export default function Difference() {
  return (
    <section
      id="why"
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
              04 / The Green Oasis difference
            </p>

            <h2 className="text-[clamp(40px,11vw,80px)] lg:text-[clamp(56px,5.6vw,80px)]">
              <span
                className={`${syne.className} block text-[#161C1B]`}
                style={{
                  fontWeight: 700,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.04em",
                }}
              >
                People before
              </span>
              <span
                className={`${dmSerif.className} block whitespace-nowrap italic text-[#0EA766]`}
                style={{
                  fontWeight: 400,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.04em",
                }}
              >
                packages. Always.
              </span>
            </h2>
          </div>

          <p
            className="max-w-[400px] text-[16px] leading-[1.55] text-[#66736A] sm:text-[18px] sm:leading-[28px] lg:pb-3"
            style={{ fontWeight: 400 }}
          >
            A good travel companion knows the details matter because your
            journey matters.
          </p>
        </div>

        {/* ========================= POINTS =========================
            */}
        <ul
          className="
            mt-10
            grid
            grid-cols-1
            gap-x-[18px]
            gap-y-10
            sm:mt-12
            sm:grid-cols-2
            lg:mt-14
            lg:grid-cols-4
          "
        >
          {POINTS.map((p) => (
            <li key={p.title} className="border-t border-[#161C1B]/15 pt-6 sm:pt-7">
              <Image
                src={p.icon}
                alt=""
                aria-hidden="true"
                className="h-6 w-6 object-contain sm:h-[26px] sm:w-[26px]"
              />

              <h3
                className={`${syne.className} mt-5 text-[20px] text-[#161C1B] sm:mt-6 sm:text-[22px]`}
                style={{
                  fontWeight: 700,
                  lineHeight: "100%",
                  letterSpacing: "-0.05em",
                }}
              >
                {p.title}
              </h3>

              <p
                className="mt-4 max-w-[360px] text-[16px] text-[#617065] sm:mt-5 sm:text-[18px]"
                style={{ fontWeight: 400, lineHeight: "1.4" }}
              >
                {p.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}