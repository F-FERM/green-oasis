import About from "../components/home/About";
import Cta from "../components/home/Cta";
import Difference from "../components/home/Difference";
import Discover from "../components/home/Discover";
import Experiences from "../components/home/Experiences";
import Footer from "../components/home/Footer";
import FounderMessage from "../components/home/FounderMessage";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Founder from "../components/home/Journey";
import Marquee from "../components/home/Marquee";
import Personas from "../components/home/Personas";
import ServicesSection from "../components/home/ServicesSection";
import StatsStrip from "../components/home/StatsStrip";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Marquee />
      <About />
      <StatsStrip />
      <Experiences />
      <Discover />
      <FounderMessage />
      <ServicesSection />
      <Difference />
      <Personas />
      <HowItWorks />
      <Founder />
      <Cta />
      <Footer />
    </main>
  );
}
