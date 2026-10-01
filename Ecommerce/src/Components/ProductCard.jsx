
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth();

  const productId = product.id || product._id;
  const availableStock = Number(product.stock) || 0;

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    // Stock check
    if (availableStock <= 0) {
      alert("Product is out of stock!");
      return;
    }

    // Login check
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    // JWT token check
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    // Product data for backend cart
    const cartProduct = {
      productId: String(productId),
      name: product.name,
      image: product.image,
      price: Number(product.price),
      quantity: 1,
      stock: availableStock,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartProduct),
        }
      );

      const data = await response.json();

      console.log("Add to cart response:", data);

      if (!response.ok) {
        alert(data.message || "Unable to add product to cart");
        return;
      }

      alert("Product added to cart successfully!");

      navigate("/cart");
    } catch (error) {
      console.log("Add to cart error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="card product-card h-100 bg-dark text-white border-warning shadow">

      {/* Product Image */}
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top product-image"
        />
      </div>

      {/* Product Information */}
      <div className="card-body d-flex flex-column p-3">

        {/* Brand */}
        <p className="product-brand text-warning small fw-semibold mb-1">
          {product.brand}
        </p>

        {/* Product Name */}
        <h5 className="product-name card-title fw-bold mb-2">
          {product.name}
        </h5>

        {/* Rating */}
        <div className="product-rating mb-2">
          <span className="rating-stars">⭐</span>{" "}
          <span>{product.rating || 0}</span>

          <span className="review-count text-secondary ms-1">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="product-price mb-2 d-flex align-items-center flex-wrap gap-2">

          <span className="price text-warning fw-bold fs-5">
            ₹
            {Number(product.price || 0).toLocaleString("en-IN")}
          </span>

          {product.originalPrice && (
            <span className="original-price text-secondary text-decoration-line-through">
              ₹
              {Number(product.originalPrice).toLocaleString("en-IN")}
            </span>
          )}

          <span className="discount badge bg-warning text-dark">
            {product.discount || 0}% off
          </span>

        </div>

        {/* Stock */}
        <p
          className={`product-stock mb-3 fw-semibold ${
            availableStock > 0
              ? "in-stock text-success"
              : "out-of-stock text-danger"
          }`}
        >
          {availableStock > 0
            ? `Available Stock: ${availableStock}`
            : "Out of Stock"}
        </p>

        {/* Actions */}
        <div className="product-actions mt-auto d-flex flex-column gap-2">

          <Link
            to={`/products/${productId}`}
            className="btn btn-outline-warning view-button fw-semibold"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn-warning add-to-cart-btn fw-bold"
            disabled={availableStock <= 0}
          >
            {availableStock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;

