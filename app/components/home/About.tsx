import Link from "next/link";
import Image from "next/image";
import { DM_Sans, Syne, DM_Serif_Display, Poppins } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import aboutImg from "../../../public/images/about.png";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["700"] });
const syne = Syne({ subsets: ["latin"], weight: ["700"] });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

const PAD = "px-4 sm:px-8 lg:px-12 xl:px-20";


const H_SIZE =
  "text-[clamp(32px,8.8vw,76px)] lg:text-[4.3vw] xl:text-[min(5vw,80px)]";

export default function About() {
  return (
    <section
      id="story"
      className={`w-full bg-[#F8F8F3] py-14 sm:py-20 lg:py-24 xl:py-[124px] ${PAD}`}
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1465px]
          items-center
          gap-10
          sm:gap-14
          lg:grid-cols-[minmax(0,1fr)_40%]
          lg:gap-12
          xl:grid-cols-[minmax(0,1fr)_min(615px,36vw)]
          xl:gap-16
        "
      >
        {/* ======================= TEXT ======================= */}
        <div className="min-w-0">
          {/* Eyebrow */}
          <p
            className={`${dmSans.className} mb-4 text-[11px] uppercase text-[#161C1B] sm:mb-5 sm:text-[12px]`}
            style={{ fontWeight: 700, lineHeight: "100%", letterSpacing: "2.16px" }}
          >
            01 / A different way to travel
          </p>

          {/* Headline */}
          <h2 className={H_SIZE} style={{ lineHeight: "1.05" }}>
            <span className="block whitespace-nowrap">
              <span
                className={`${syne.className} text-[#161C1B]`}
                style={{ fontWeight: 700, letterSpacing: "-0.07em" }}
              >
                It’s not about{" "}
              </span>
              <span
                className={`${dmSerif.className} italic text-[#0EA766]`}
                style={{ fontWeight: 400, letterSpacing: "-0.045em" }}
              >
                how far.
              </span>
            </span>
            <span className="block whitespace-nowrap">
              <span
                className={`${syne.className} text-[#161C1B]`}
                style={{ fontWeight: 700, letterSpacing: "-0.07em" }}
              >
                It’s about{" "}
              </span>
              <span
                className={`${dmSerif.className} italic text-[#0EA766]`}
                style={{ fontWeight: 400, letterSpacing: "-0.045em" }}
              >
                how you feel.
              </span>
            </span>
          </h2>

          {/* Paragraphs */}
          <div
            className={`
              ${poppins.className}
              mt-8
              max-w-[660px]
              text-[16px]
              leading-[1.6]
              text-[#536158]
              sm:mt-10
              sm:text-[18px]
              sm:leading-[28.9px]
              lg:mt-12
            `}
            style={{ fontWeight: 400 }}
          >
            <p>
              Travel is more than the places we visit. It’s the moments that
              bring us closer, the conversations that stay with us, and the
              space to reconnect with ourselves.
            </p>
            <p className="mt-[10px]">
              At Green Oasis, every journey begins with listening. We get to
              know what matters to you, then thoughtfully shape the experience
              around it.
            </p>
          </div>

          {/* Button */}
          <Link
            href="#why"
            className={`
              ${dmSans.className}
              group
              mt-8
              inline-flex
              min-h-[60px]
              w-[277px]
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
              sm:text-[18px]
            `}
            style={{ fontWeight: 700, lineHeight: "100%" }}
          >
            Get to know us
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
        </div>

        {/* ======================= IMAGE ======================= */}
        <div
          className="
            relative
            mx-auto
            aspect-[615/608]
            w-full
            max-w-[615px]
            overflow-hidden
            rounded-t-[330px]
            rounded-b-[30px]
            lg:mx-0
            lg:ml-auto
          "
        >
          <Image
            src={aboutImg}
            alt="Mountain valley at sunrise"
            fill
            sizes="(min-width: 1280px) 615px, (min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}