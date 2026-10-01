
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductSection.css";

function ProductSection({ category }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 4;

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Failed to fetch products:", error);
      });
  }, []);

  const filteredProducts = category
    ? products.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === category.toLowerCase()
      )
    : products;

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="product-section py-5">
      <div className="container">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

          <div>
            <p className="product-section-subtitle mb-1">
              Explore Our Collection
            </p>

            <h2 className="product-section-title mb-0">
              {category
                ? `${category} Products`
                : "Featured Products"}
            </h2>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center gap-2">

              <button
                type="button"
                className="btn btn-outline-warning"
                onClick={previousPage}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-outline-warning"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>

            </div>
          )}

        </div>

        {/* Products */}
        <div className="row g-4">

          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={product._id || product.id}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="no-products text-center py-5">
                <h5>No products found in this category.</h5>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default ProductSection;

