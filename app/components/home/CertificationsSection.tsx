import Image from "next/image";
import { dmSans, syne, dmSerif } from "@/app/fonts";

const CERTIFICATIONS = [
  { src: "/images/certifications/bni.png", alt: "BNI" },
  { src: "/images/certifications/tafi.png", alt: "TAFI" },
  { src: "/images/certifications/vittc.png", alt: "VITTC" },
  { src: "/images/certifications/iso.png", alt: "ISO" },
  { src: "/images/certifications/toai.png", alt: "TOAI" },
  { src: "/images/certifications/iata.png", alt: "IATA" },
];

export default function CertificationsSection() {
  return (
    <section
      id="certifications"
      className={`${dmSans.className} w-full overflow-hidden bg-[#F7F8F1] px-4 py-14 text-black sm:px-8 sm:py-20 lg:px-12 xl:px-20`}
    >
      <div className="mx-auto w-full max-w-[1465px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center lg:mb-[58px]">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#111916]">
              07 / Our certifications
            </p>

            <h2 className="leading-[1.03]">
              <span
                className={`${syne.className} block text-[clamp(36px,4.3vw,54px)] font-bold tracking-[-0.065em]`}
              >
                Recognised for Trust.
              </span>

              <span
                className={`${dmSerif.className} mt-1 block text-[clamp(34px,4.1vw,51px)] italic leading-[1.05] tracking-[-0.035em] text-[#0BA66A]`}
              >
                Committed to Excellence.
              </span>
            </h2>
          </div>

          <p className="max-w-[310px] pb-1 text-[13px] leading-[1.65] text-[#748078] sm:text-[14px]">
            Our certifications reflect our commitment to quality, reliability,
            and professional standards, giving you greater confidence in every
            journey.
          </p>
        </div>
      </div>

      {/* Full-width continuous logo animation */}
      <div className="certification-marquee w-full overflow-hidden">
        <div className="certification-track flex w-max items-center">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="certification-group flex shrink-0 items-center"
              aria-hidden={group === 1}
            >
              {CERTIFICATIONS.map((item, index) => (
                <div
                  key={`${item.alt}-${index}`}
                  className="flex h-[112px] w-[clamp(190px,16.3vw,260px)] shrink-0 items-center justify-center px-7"
                >
                  <Image
                    src={item.src}
                    alt={group === 0 ? item.alt : ""}
                    width={220}
                    height={110}
                    sizes="(min-width: 1024px) 220px, 180px"
                    className="h-full max-h-[100px] w-full object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .certification-track {
          animation: certification-scroll 28s linear infinite;
          will-change: transform;
        }

        .certification-marquee:hover .certification-track {
          animation-play-state: paused;
        }

        @keyframes certification-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .certification-track {
            animation-duration: 24s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .certification-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
