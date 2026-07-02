import { FeatureHighlights } from "../components/home/FeatureHighlights";
import { HeroSection } from "../components/home/HeroSection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeatureHighlights />
    </main>
  );
}
