
import { useParams } from "react-router-dom";
import ProductSection from "../Components/ProductSection";

function CategoryProduct() {
  const { category } = useParams();

  const categoryMap = {
    mobiles: "Mobiles",
    fashion: "Fashion",
    electronics: "Electronics",
    "home-kitchen": "Home & Kitchen",
    beauty: "Beauty",
    grocery: "Grocery",
  };

  const actualCategory =
    categoryMap[category?.toLowerCase()];

  return (
    <main className="bg-black text-white min-vh-100 py-4">
      <div className="container-fluid">
        <ProductSection category={actualCategory} />
      </div>
    </main>
  );
}

export default CategoryProduct;

