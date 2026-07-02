import dynamic from "next/dynamic";
import { HeroSection } from "../components/home/HeroSection";

const FeatureHighlights = dynamic(() =>
  import("../components/home/FeatureHighlights").then((module) => module.FeatureHighlights)
);
const NewsletterForm = dynamic(() => import("../components/home/NewsletterForm").then((module) => module.NewsletterForm), {
  loading: () => <div className="px-6 py-14" />
});

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeatureHighlights />
      <NewsletterForm />
    </main>
  );
}
