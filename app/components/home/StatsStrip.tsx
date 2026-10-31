import { syne, dmSerif } from "@/app/fonts";

const STATS = [
  { value: "150,000", suffix: "+", label: "Happy Travellers" },
  { value: "60", suffix: "+", label: "Unique Tour Packages" },
  { value: "16", suffix: "+", label: "Years of Experience" },
  { value: "98", suffix: "%", label: "Repeat Booking Rate" },
];

export default function StatsStrip() {
  return (
    <section
      aria-label="Green Oasis statistics"
      className="flex min-h-[116px] w-full items-center bg-[#004530] px-5"
    >
      <div className="mx-auto grid w-full max-w-[1112px] grid-cols-4 items-center">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-col items-center justify-center text-center text-white"
          >
            <p
              className={`${syne.className} whitespace-nowrap text-[clamp(22px,3.3vw,38px)] font-normal leading-[1] tracking-[-0.055em]`}
            >
              {stat.value}
              <span className="ml-[1px] text-[0.58em] tracking-[-0.035em]">
                {stat.suffix}
              </span>
            </p>

            <p
              className={`${dmSerif.className} mt-[5px] whitespace-nowrap text-[10px] font-normal italic leading-[1.1] text-white/80`}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
