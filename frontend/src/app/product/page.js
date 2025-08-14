import ProductHero from "../../components/product/ProductHero";
import ProductSteps from "../../components/product/ProductSteps";
import ProductComparison from "../../components/product/ProductComparison";
import FAQ from "../../components/home/faq";
import RefreshImagesSection from "@/components/useCases/RefreshImagesSection";
import { steps } from "@/data/product";

export const metadata = {
  title: 'Product | FashionX',
  description: 'Learn how our AI generated fashion models work',
};

export default function ProductPage() {
  // Map steps data to match the format expected by RefreshImagesSection
  const mappedSteps = steps.map(step => ({
    id: step.number,
    mainImage: step.image, // Map 'image' to 'mainImage'
    title: step.title,
    description: step.description
  }));

  return (
    <main className="min-h-screen">
      {/* Product Hero Section */}
      <ProductHero />
      
      {/* Product Steps Section with Sticky Scroll */}
      {/* <ProductSteps /> */}
      <RefreshImagesSection content={mappedSteps} />
      
      {/* Product Comparison Section */}
      <ProductComparison />
      
      {/* FAQ Section */}
      <FAQ />
    </main>
  );
}