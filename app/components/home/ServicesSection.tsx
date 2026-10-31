import { DM_Sans, DM_Serif_Display, Syne } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const SERVICES = [
  {
    number: "01",
    title: "International Tours",
    description:
      "Explore destinations around the world with thoughtfully curated international travel packages.",
  },
  {
    number: "02",
    title: "Domestic Tours",
    description:
      "Discover India’s beautiful destinations with comfortable, well-planned travel experiences.",
  },
  {
    number: "03",
    title: "Customized Tours",
    description:
      "Personalised itineraries designed around your interests, preferences, and travel needs.",
  },
  {
    number: "04",
    title: "Hajj & Umrah",
    description:
      "Meaningful spiritual journeys with carefully arranged travel support and guidance.",
  },
  {
    number: "05",
    title: "Visa Assistance",
    description:
      "Travel visa assistance to help make your international journey easier.",
  },
  {
    number: "06",
    title: "Flight Ticket Booking",
    description:
      "Flight booking assistance for domestic and international travel.",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className={`${dmSans.className} w-full bg-[#DDF5E1] px-5 py-16 text-[#171F1C] sm:px-8 sm:py-20 lg:px-[7%] lg:py-[76px]`}
    >
      <div className="mx-auto w-full max-w-[1358px]">
        {/* Section heading */}
        <div className="mb-9 flex flex-col justify-between gap-6 lg:mb-[38px] lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.19em] text-[#27332E] sm:text-[11px]">
              05 / Explore our services
            </p>

            <h2 className="leading-[1.02]">
              <span
                className={`${syne.className} block text-[clamp(39px,5.2vw,68px)] font-bold tracking-[-0.065em]`}
              >
                Different journeys.
              </span>
              <span
                className={`${dmSerif.className} mt-1 block text-[clamp(37px,4.7vw,64px)] italic leading-[1.05] tracking-[-0.035em] text-[#004530]`}
              >
                One trusted companion.
              </span>
            </h2>
          </div>

          <p className="max-w-[350px] pb-1 text-[14px] leading-[1.7] text-[#75827A] sm:text-[15px] lg:mb-1">
            A good travel companion knows the details because your journey
            matters.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-[17px] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.number}
              className="group flex min-h-[205px] flex-col items-start rounded-[13px] bg-white px-[30px] py-[30px] transition-colors duration-300 ease-out hover:bg-[#A4EA6D] sm:min-h-[205px] sm:px-[38px] sm:py-[34px]"
            >
              <span className="text-[10px] font-medium leading-none tracking-[0.02em] text-[#84988B] transition-colors duration-300 group-hover:text-[#426C42]">
                {service.number} /
              </span>

              <h3
                className={`${syne.className} mt-[27px] text-[20px] font-bold leading-[1.25] tracking-[-0.055em] text-[#1B2420] transition-colors duration-300 group-hover:text-[#004530] sm:text-[21px]`}
              >
                {service.title}
              </h3>

              <p className="mt-[24px] max-w-[390px] text-[14px] leading-[1.5] text-[#68756D] transition-colors duration-300 group-hover:text-[#31563B] sm:text-[14.5px]">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
