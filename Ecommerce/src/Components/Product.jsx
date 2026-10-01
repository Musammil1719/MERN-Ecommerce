
import "./ProductCard.css";

function ProductCard({ product }) {
  const stock = Number(product.stock) || 0;

  return (
    <div className="card product-card h-100">

      {/* Product Image */}
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top product-image"
        />
      </div>

      {/* Product Information */}
      <div className="card-body d-flex flex-column">

        <p className="product-brand mb-1">
          {product.brand}
        </p>

        <h3 className="product-name card-title">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="product-rating mb-2">
          ⭐ {product.rating}
          <span className="review-count">
            {" "}({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="product-price mb-2">
          <span className="price">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </span>

          <span className="original-price">
            ₹
            {Number(
              product.originalPrice || 0
            ).toLocaleString("en-IN")}
          </span>

          <span className="discount">
            {product.discount}% off
          </span>
        </div>

        {/* Stock */}
        <p
          className={`product-stock ${
            stock > 0 ? "in-stock" : "out-of-stock"
          }`}
        >
          {stock > 0
            ? `Available Stock: ${stock}`
            : "Out of Stock"}
        </p>

        {/* Buttons */}
        <div className="mt-auto d-flex flex-column gap-2">

          <button
            type="button"
            className="btn btn-outline-warning view-button"
          >
            View Details
          </button>

          <button
            type="button"
            className="btn btn-warning cart-button"
            disabled={stock === 0}
          >
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;

