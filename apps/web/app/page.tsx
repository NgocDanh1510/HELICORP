import { FeatureHighlights } from "../components/home/FeatureHighlights";
import { HeroSection } from "../components/home/HeroSection";
import { NewsletterForm } from "../components/home/NewsletterForm";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeatureHighlights />
      <NewsletterForm />
    </main>
  );
}
