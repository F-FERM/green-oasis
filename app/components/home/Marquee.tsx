import Image from "next/image";
import starImg from "../../../public/images/charm_north-star.png";
import { dmSans } from "@/app/fonts";

const ITEMS = [
  "Travel for you",
  "Return with more",
  "People before packages",
  "Journeys that mean more",
];

const GROUPS = [0, 1, 2, 3, 4, 5];

/* Timing for the fast pass */
const WAIT = 5; 
const SWEEP = 2; 
const CYCLE = WAIT + SWEEP;
const WAIT_PCT = (WAIT / CYCLE) * 100;

function Item({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-[8px] sm:gap-[12px]">
      <span
        className="whitespace-nowrap text-[12px] uppercase sm:text-[15px] lg:text-[18px]"
        style={{ fontWeight: 800, lineHeight: "100%" }}
      >
        {text}
      </span>
      <Image
        src={starImg}
        alt=""
        aria-hidden="true"
        className="h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5 lg:h-6 lg:w-6"
      />
    </li>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="Our promise"
      className={`
        ${dmSans.className}
        relative w-full overflow-hidden
        bg-[#A4EA6D] py-[17px] text-[#004530]
      `}
    >
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-16.6667%, 0, 0); }
        }

        /* rests off-screen for WAIT seconds, then sweeps across fast */
        @keyframes fast-pass {
          0%, ${WAIT_PCT}% { transform: translate3d(100vw, 0, 0); }
          100%             { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>

      {/* BASE layer – normal slow marquee, original colours */}
      <div className="flex w-max animate-[ticker-scroll_10s_linear_infinite] items-center will-change-transform motion-reduce:animate-none">
        {GROUPS.map((g) => (
          <ul
            key={g}
            aria-hidden={g > 0}
            className="flex shrink-0 items-center gap-[12px] pr-[30px] sm:gap-[17px] lg:pr-[50px]"
          >
            {ITEMS.map((text) => (
              <Item key={text} text={text} />
            ))}
          </ul>
        ))}
      </div>

   
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 flex w-max items-center  will-change-transform motion-reduce:hidden"
        style={{ animation: `fast-pass ${CYCLE}s linear infinite` }}
      >
        <ul className="flex items-center gap-[32px] px-[40px] sm:gap-[48px]">
          {ITEMS.map((text) => (
            <Item key={text} text={text} />
          ))}
        </ul>
      </div>
    </section>
  );
}