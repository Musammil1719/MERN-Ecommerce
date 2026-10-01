
import CategorySection from "../Components/CategorySection";
import HeroBanner from "../Components/HeroBanner";
import ProductSection from "../Components/ProductSection";

function Home() {
  return (
    <main className="bg-black text-white min-vh-100">

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <CategorySection />

      {/* Products */}
      <ProductSection />

    </main>
  );
}

export default Home;

