
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import products from "../data/Product.json";
import "./ProductDetail.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn, userId } = useAuth();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="alert alert-dark border-warning text-warning">
          <h2 className="mb-0">Product not found</h2>
        </div>
      </div>
    );
  }

  // =========================
  // CHECK LOGIN
  // =========================

  const checkLogin = () => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return false;
    }

    return true;
  };

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    if (!checkLogin()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: String(product.id),
            name: product.name,
            image: product.image,
            price: Number(product.price),
            quantity: 1,
            stock: Number(product.stock || 0),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add product to cart.");
        return;
      }

      alert("Product added to cart successfully!");

      navigate("/cart");
    } catch (error) {
      console.log("ADD TO CART ERROR:", error);
      alert("Something went wrong while adding to cart.");
    }
  };

  // =========================
  // BUY NOW
  // =========================

  const handleBuyNow = async () => {
    if (!checkLogin()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: String(product.id),
            name: product.name,
            image: product.image,
            price: Number(product.price),
            quantity: 1,
            stock: Number(product.stock || 0),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add product to cart.");
        return;
      }

      navigate("/cart");
    } catch (error) {
      console.log("BUY NOW ERROR:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <main className="product-details-page bg-black text-white min-vh-100 py-4 py-md-5">

      <div className="container">

        <div className="card product-details bg-dark text-white border-warning shadow-lg overflow-hidden">

          <div className="row g-0">

            {/* =========================
                PRODUCT IMAGE
            ========================= */}

            <div className="col-12 col-lg-6">

              <div className="details-image d-flex align-items-center justify-content-center h-100 p-3 p-md-5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid"
                />
              </div>

            </div>

            {/* =========================
                PRODUCT INFORMATION
            ========================= */}

            <div className="col-12 col-lg-6">

              <div className="details-info card-body p-4 p-md-5">

                {/* Brand */}
                <p className="details-brand text-warning fw-semibold mb-2">
                  {product.brand}
                </p>

                {/* Product Name */}
                <h1 className="display-6 fw-bold mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="details-rating mb-3">
                  <span className="text-warning">
                    ⭐ {product.rating}
                  </span>

                  <span className="text-secondary ms-2">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <hr className="border-secondary" />

                {/* Price */}
                <div className="details-price d-flex align-items-center flex-wrap gap-3 my-4">

                  <span className="current-price text-warning fw-bold fs-2">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>

                  <span className="old-price text-secondary text-decoration-line-through">
                    ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                  </span>

                  <span className="discount badge bg-warning text-dark fs-6">
                    {product.discount}% off
                  </span>

                </div>

                {/* Description */}
                <p className="details-description text-light lh-lg mb-4">
                  {product.description}
                </p>

                {/* Colors */}
                {product.colors && (
                  <div className="details-option mb-4">

                    <h5 className="text-warning fw-bold mb-3">
                      Available Colors
                    </h5>

                    <div className="option-list d-flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span
                          key={color}
                          className="badge border border-warning text-warning bg-transparent px-3 py-2"
                        >
                          {color}
                        </span>
                      ))}
                    </div>

                  </div>
                )}

                {/* Sizes */}
                {product.sizes && (
                  <div className="details-option mb-4">

                    <h5 className="text-warning fw-bold mb-3">
                      Available Sizes
                    </h5>

                    <div className="option-list d-flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="badge border border-warning text-warning bg-transparent px-3 py-2"
                        >
                          {size}
                        </span>
                      ))}
                    </div>

                  </div>
                )}

                {/* Features */}
                <div className="features mb-4">

                  <h5 className="text-warning fw-bold mb-3">
                    Key Features
                  </h5>

                  <ul className="list-group list-group-flush">

                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="list-group-item bg-transparent text-light border-secondary px-0"
                      >
                        <span className="text-warning me-2">✓</span>
                        {feature}
                      </li>
                    ))}

                  </ul>

                </div>

                {/* Buttons */}
                <div className="details-buttons d-grid d-sm-flex gap-3 mt-4">

                  <button
                    type="button"
                    className="btn btn-warning btn-lg fw-bold px-4"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-warning btn-lg fw-bold px-4"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;

