
import YathraContactForm from "../components/home/YathraContactForm";
import YathraFooter from "../components/home/YathraFooter";
import YathraHero from "../components/home/YathraHero";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <YathraHero/>
       <YathraContactForm />
      <YathraFooter />
    </main>
  );
}
