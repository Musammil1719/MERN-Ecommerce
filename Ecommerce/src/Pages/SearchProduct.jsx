
import { useParams } from "react-router-dom";
import products from "../data/Product.json";
import ProductCard from "../Components/ProductCard";
import "./SearchProduct.css";

function SearchProducts() {
  const { searchTerm } = useParams();

  const search = searchTerm?.toLowerCase() || "";

  const searchResults = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.subcategory.toLowerCase().includes(search)
    );
  });

  return (
    <main className="search-page bg-black text-white min-vh-100 py-4 py-md-5">

      <div className="container">

        {/* Search Heading */}
        <div className="search-header text-center mb-4 mb-md-5">

          <p className="text-warning fw-semibold mb-2">
            PRODUCT SEARCH
          </p>

          <h2 className="fw-bold">
            Search Results for{" "}
            <span className="text-warning">
              "{searchTerm}"
            </span>
          </h2>

          {searchResults.length > 0 && (
            <p className="text-secondary mt-2 mb-0">
              {searchResults.length} product
              {searchResults.length > 1 ? "s" : ""} found
            </p>
          )}

        </div>

        {/* No Results */}
        {searchResults.length === 0 ? (

          <div className="no-results text-center py-5">

            <div className="card bg-dark border-warning text-white mx-auto no-results-card">

              <div className="card-body p-4 p-md-5">

                <div className="display-4 mb-3">
                  🔍
                </div>

                <h3 className="text-warning fw-bold mb-3">
                  No Products Found
                </h3>

                <p className="text-secondary mb-0">
                  Try searching with another product name.
                </p>

              </div>

            </div>

          </div>

        ) : (

          /* Search Results */
          <div className="row g-4">

            {searchResults.map((product) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={product.id}
              >
                <ProductCard product={product} />
              </div>
            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default SearchProducts;

