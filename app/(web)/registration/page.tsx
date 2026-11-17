import YathraContactForm from "@/app/components/home/YathraContactForm";
import YathraFooter from "@/app/components/home/YathraFooter";
import YathraHero from "@/app/components/home/YathraHero";


export default function HomePage() {
  return (
    <main className="min-h-screen">
      <YathraHero/>
       <YathraContactForm />
      <YathraFooter />
    </main>
  );
}
