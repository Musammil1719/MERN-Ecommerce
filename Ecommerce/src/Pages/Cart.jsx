
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const { userId, isLoggedIn } = useAuth();

  // ===============================
  // FETCH CART FROM BACKEND
  // ===============================

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setCart([]);
      return;
    }

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setCart([]);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/cart",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.log("Cart fetch failed:", data);
          setCart([]);
          return;
        }

        setCart(data.items || []);

        const message = localStorage.getItem("cartSuccess");

        if (message) {
          setSuccessMessage(message);

          localStorage.removeItem("cartSuccess");

          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        }
      } catch (error) {
        console.log("Error fetching cart:", error);
        setCart([]);
      }
    };

    fetchCart();
  }, [isLoggedIn, userId]);

  // ===============================
  // INCREASE QUANTITY
  // ===============================

  const increaseQuantity = async (productId) => {
    const product = cart.find(
      (item) => item.productId === productId
    );

    if (!product) return;

    if (product.quantity >= product.stock) {
      alert("Maximum available stock reached");
      return;
    }

    const newQuantity = product.quantity + 1;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update cart");
        return;
      }

      setCart(data.cart.items);
    } catch (error) {
      console.log("Increase quantity error:", error);
    }
  };

  // ===============================
  // DECREASE QUANTITY
  // ===============================

  const decreaseQuantity = async (productId) => {
    const product = cart.find(
      (item) => item.productId === productId
    );

    if (!product) return;

    const newQuantity = product.quantity - 1;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update cart");
        return;
      }

      setCart(data.cart.items);
    } catch (error) {
      console.log("Decrease quantity error:", error);
    }
  };

  // ===============================
  // REMOVE PRODUCT
  // ===============================

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to remove product");
        return;
      }

      setCart(data.cart.items);
    } catch (error) {
      console.log("Remove cart error:", error);
    }
  };

  // ===============================
  // TOTAL ITEMS
  // ===============================

  const totalItems = cart.reduce(
    (total, product) =>
      total + (product.quantity || 1),
    0
  );

  // ===============================
  // TOTAL PRICE
  // ===============================

  const totalPrice = cart.reduce(
    (total, product) =>
      total +
      product.price * (product.quantity || 1),
    0
  );

  // ===============================
  // UI
  // ===============================

  return (
    <main className="cart-page bg-black text-white min-vh-100 py-4 py-md-5">

      <div className="container">

        {/* Success Message */}
        {successMessage && (
          <div
            className="alert alert-success border-0 shadow mb-4"
            role="alert"
          >
            ✓ {successMessage}
          </div>
        )}

        {/* Heading */}
        <div className="text-center mb-4">

          <p className="text-warning fw-semibold mb-2">
            SHOPPING CART
          </p>

          <h2 className="fw-bold">
            My Cart
          </h2>

          {cart.length > 0 && (
            <p className="text-secondary mb-0">
              {totalItems} item{totalItems > 1 ? "s" : ""} in your cart
            </p>
          )}

        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (

          <div className="empty-cart text-center">

            <div className="card bg-dark border-warning text-white mx-auto empty-cart-card">

              <div className="card-body p-5">

                <div className="display-3 mb-3">
                  🛒
                </div>

                <h3 className="text-warning fw-bold">
                  Your cart is empty
                </h3>

                <p className="text-secondary mb-4">
                  Add some products to your cart.
                </p>

                <button
                  type="button"
                  className="btn btn-warning fw-bold px-4"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>

              </div>

            </div>

          </div>

        ) : (

          <div className="row g-4">

            {/* Cart Items */}
            <div className="col-12 col-lg-8">

              <div className="cart-items">

                {cart.map((product) => {
                  const productId = product.productId;
                  const quantity = product.quantity || 1;

                  return (
                    <div
                      className="card cart-item bg-dark text-white border-secondary mb-3"
                      key={productId}
                    >

                      <div className="card-body p-3 p-md-4">

                        <div className="row align-items-center g-3">

                          {/* Image */}
                          <div className="col-4 col-sm-3 col-md-2">

                            <div className="cart-image-wrapper">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="img-fluid"
                              />
                            </div>

                          </div>

                          {/* Product Info */}
                          <div className="col-8 col-sm-9 col-md-5">

                            <h5 className="fw-bold mb-2">
                              {product.name}
                            </h5>

                            <p className="text-warning fw-bold mb-3">
                              ₹
                              {Number(
                                product.price || 0
                              ).toLocaleString("en-IN")}
                            </p>

                            {/* Quantity */}
                            <div className="d-flex align-items-center gap-2">

                              <button
                                type="button"
                                className="btn btn-outline-warning quantity-btn"
                                onClick={() =>
                                  decreaseQuantity(productId)
                                }
                              >
                                −
                              </button>

                              <span className="quantity-value">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                className="btn btn-outline-warning quantity-btn"
                                onClick={() =>
                                  increaseQuantity(productId)
                                }
                              >
                                +
                              </button>

                            </div>

                          </div>

                          {/* Total + Remove */}
                          <div className="col-12 col-md-5 text-md-end">

                            <div className="cart-item-total text-warning fw-bold fs-5 mb-3">
                              ₹
                              {(
                                product.price * quantity
                              ).toLocaleString("en-IN")}
                            </div>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                removeFromCart(productId)
                              }
                            >
                              Remove
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* Cart Summary */}
            <div className="col-12 col-lg-4">

              <div className="card cart-summary bg-dark text-white border-warning sticky-lg-top">

                <div className="card-body p-4">

                  <h4 className="text-warning fw-bold mb-4">
                    Cart Summary
                  </h4>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-secondary">
                      Total Items
                    </span>

                    <span className="fw-semibold">
                      {totalItems}
                    </span>
                  </div>

                  <hr className="border-secondary" />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold">
                      Total
                    </span>

                    <span className="text-warning fw-bold fs-4">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-warning w-100 fw-bold py-3"
                    onClick={() =>
                      navigate("/checkout")
                    }
                  >
                    Proceed to Checkout
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}

export default Cart;

