import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import PourquoiNousChoisir from "@/components/PourquoiNousChoisir";
import MomentsPrecieux from "@/components/MomentsPrecieux";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CategoryCards />
      <FeaturedProducts />
      <PourquoiNousChoisir />
      <MomentsPrecieux />
    </main>
  );
}
