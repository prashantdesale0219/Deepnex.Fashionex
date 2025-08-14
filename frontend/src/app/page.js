import HeroSlider from "../components/home/heroSlider";
import HowItWorks from "../components/home/howItWorks";
import Stats from "../components/home/stats";
import Grids from "../components/home/grids";
import BeforeAfter from "../components/home/beforeAfter";
import AISolutions from "../components/home/aiSolutions";
import Testimonials from "../components/home/testimonials";
import FAQ from "../components/home/faq";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Stats Section */}
      <Stats />
      
      {/* Grids Section */}
      <Grids />
      
      {/* Before After Section */}
      <BeforeAfter />
      
      {/* AI Solutions Section */}
      <AISolutions />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* FAQ Section */}
      <FAQ />
    </main>
  );
}
