import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import image1 from "../../../public/images/ex1.jpg";
import image2 from "../../../public/images/ex2.jpg";
import image3 from "../../../public/images/ex3.jpg";
import image4 from "../../../public/images/ex4.jpg";
import image5 from "../../../public/images/ex5.jpg";
import { dmSans, syne, dmSerif } from "@/app/fonts";

/* Same side padding as Hero / Founder */
const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";

const PACKAGES = [
  {
    duration: "5 Days 4 Night",
    title: "Explore Almaty: Mountains, Canyons & Lakes",
    price: "₹120,000",
    image: image1,
    href: "/experiences/almaty",
  },
  {
    duration: "",
    title: "Georgia and Armenia",
    price: "₹1,88,000",
    image: image2,
    href: "/experiences/georgia-armenia",
  },
  {
    duration: "5 Days 4 Night",
    title: "Azerbaijan Explorer",
    price: "₹1,10,000",
    image: image3,
    href: "/experiences/azerbaijan",
  },
  {
    duration: "5 Days 4 Night",
    title: "Discover Egypt",
    price: "₹1,02,000",
    image: image4,
    href: "/experiences/egypt",
  },
  {
    duration: "5 Days 4 Night",
    title: "Thailand",
    price: "₹65,500",
    image: image5,
    href: "/experiences/thailand",
  },
];

const CARD = `
  group relative isolate flex
  min-h-[380px] w-full flex-col justify-end
  overflow-hidden rounded-[20px]
  [container-type:inline-size]
  [--c:clamp(40px,14.1cqw,60px)]
  [transform:translateZ(0)]
  sm:min-h-[340px] sm:aspect-[425/450]
`;

const INNER =
  "z-10 flex flex-col px-[5.65cqw] pb-[6.6cqw] pt-[5.65cqw]";

const EYEBROW = {
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "2.16px",
} as const;

const EYEBROW_SIZE = "text-[clamp(10px,2.82cqw,12px)]";

const RING_STYLE = {
  padding: "1.5px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.55) 100%)",
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as React.CSSProperties;


function ArrowCircle({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: "glass" | "lime";
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`
        after:absolute
        after:inset-0
        after:z-20
        after:content-['']
        focus:outline-none
        focus-visible:after:ring-2
        ${
          tone === "glass"
            ? "focus-visible:after:ring-[#A4EA6D]"
            : "focus-visible:after:ring-[#004530]"
        }
      `}
    >
      <span
        className={`
          absolute
          bottom-[7cqw]
          right-[5.65cqw]
          grid
          h-[var(--c)]
          w-[var(--c)]
          place-items-center
          rounded-full
          bg-[rgba(120,120,120,0.28)]
          backdrop-blur-md
          transition-colors
          duration-300
          ${
            tone === "glass"
              ? "text-white group-hover:bg-[#A4EA6D75]"
              : "text-[#004530] group-hover:bg-[#004530] group-hover:text-[#A4EA6D]"
          }
        `}
      >
        {/* gradient ring */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={RING_STYLE}
        />
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="h-[44%] w-[44%] transition-transform duration-300 ease-out group-hover:rotate-45"
        />
      </span>
    </Link>
  );
}

export default function Experiences() {
  return (
    <section
      id="experiences"
      className={`${dmSans.className} w-full bg-[#EAF3E7] py-14 sm:py-20 xl:py-[90px] ${PAD}`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        {/* ========================= HEADER ========================= */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div>
            <p
              className="mb-4 text-[11px] uppercase text-[#161C1B] sm:mb-5 sm:text-[12px]"
              style={EYEBROW}
            >
              02 / Experiences made for you
            </p>

            <h2 className="text-[clamp(40px,9vw,80px)] lg:text-[clamp(56px,6vw,80px)]">
              <span
                className={`${syne.className} block text-[#161C1B]`}
                style={{
                  fontWeight: 700,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.0653em",
                }}
              >
                Every journey
              </span>
              <span
                className={`${dmSerif.className} block italic text-[#0EA766]`}
                style={{
                  fontWeight: 400,
                  lineHeight: "0.9685",
                  letterSpacing: "-0.0403em",
                }}
              >
                has a reason.
              </span>
            </h2>
          </div>

          <p
            className="max-w-[390px] text-[16px] leading-[1.5] text-[#66736A] sm:text-[18px] sm:leading-[27px] lg:pb-3"
            style={{ fontWeight: 400 }}
          >
            From unhurried escapes to meaningful journeys of faith, find a way
            to travel that feels right for you.
          </p>
        </div>

        {/* ========================= CARDS =========================
            */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            sm:gap-6
            lg:grid-cols-3
            lg:gap-x-[clamp(20px,4vw,95px)]
            lg:gap-y-[clamp(20px,2.4vw,40px)]
          "
        >
          {PACKAGES.map((item) => (
            <article key={item.href} className={CARD}>
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 425px, (min-width: 640px) 50vw, 100vw"
                className="
                  z-0
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  will-change-transform
                  group-hover:scale-110
                "
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)",
                }}
              />

              <div className={INNER}>
                {item.duration && (
                  <p
                    className={`mb-[2.35cqw] uppercase text-white ${EYEBROW_SIZE}`}
                    style={EYEBROW}
                  >
                    {item.duration}
                  </p>
                )}

                {/* right padding keeps the text clear of the circle */}
                <h3
                  className={`${syne.className} pr-[calc(var(--c)+2.8cqw)] text-[clamp(20px,7.5cqw,32px)] text-white`}
                  style={{
                    fontWeight: 700,
                    lineHeight: "1.12",
                    letterSpacing: "-0.034em",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-[2.35cqw] pr-[calc(var(--c)+2.8cqw)] text-[clamp(13px,4.7cqw,20px)] text-[#C7C7C7]"
                  style={{ fontWeight: 400, lineHeight: "1.2" }}
                >
                  From{" "}
                  <span
                    className="text-[1.2em] text-[#A4EA6D]"
                    style={{ fontWeight: 400 }}
                  >
                    {item.price}
                  </span>{" "}
                  /Per Person
                </p>

                <ArrowCircle
                  href={item.href}
                  label={`${item.title}${
                    item.duration ? `, ${item.duration}` : ""
                  }`}
                  tone="glass"
                />
              </div>
            </article>
          ))}

          {/* ===================== CTA CARD ===================== */}
          <article className={`${CARD} bg-[#A4EA6D] !justify-between`}>
            <p
              className={`relative z-10 p-[5.65cqw] uppercase text-[#004530] ${EYEBROW_SIZE}`}
              style={EYEBROW}
            >
              Let’s make it personal
            </p>

            <div className={INNER}>
              <h3
                className={`${syne.className} text-[clamp(26px,9.4cqw,40px)] text-[#004530]`}
                style={{
                  fontWeight: 700,
                  lineHeight: "1.2",
                  letterSpacing: "-0.025em",
                }}
              >
                Have
                <br />
                somewhere
                <br />
                in mind?
              </h3>

              <p
                className="mt-[2.35cqw] pr-[calc(var(--c)+2.8cqw)] text-[clamp(13px,4.2cqw,18px)] text-[#004530]"
                style={{ fontWeight: 400, lineHeight: "1.2" }}
              >
                Tell us what matters. We’ll take it from there.
              </p>

              <ArrowCircle
                href="#cta"
                label="Plan your journey"
                tone="lime"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}