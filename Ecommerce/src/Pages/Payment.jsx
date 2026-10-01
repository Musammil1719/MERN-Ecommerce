import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();

  const { userId, isLoggedIn } = useAuth();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // ==========================================
  // FETCH CART FROM BACKEND
  // ==========================================

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setCart([]);
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Session expired. Please login again.");
          navigate("/login");
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

        console.log("Payment cart response:", data);

        if (!response.ok) {
          console.log("Payment cart fetch failed:", data);

          if (response.status === 401) {
            alert("Session expired. Please login again.");
            navigate("/login");
            return;
          }

          setCart([]);
          return;
        }

        setCart(data.items || []);
      } catch (error) {
        console.log("Payment cart error:", error);
        alert("Unable to load cart");
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn, userId, navigate]);

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice = cart.reduce(
    (total, product) =>
      total + product.price * (product.quantity || 1),
    0
  );

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async () => {
    if (placingOrder) {
      return;
    }

    // LOGIN CHECK

    if (!isLoggedIn || !userId) {
      alert("Please login before placing an order");
      navigate("/login");
      return;
    }

    // PAYMENT METHOD CHECK

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // CART CHECK

    if (cart.length === 0) {
      alert("Your cart is empty");
      navigate("/cart");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setPlacingOrder(true);

      // ========================================
      // GET CURRENT STOCK
      // ========================================

      const savedStock =
        JSON.parse(
          localStorage.getItem("productStock")
        ) || {};

      // ========================================
      // CHECK STOCK BEFORE ORDER
      // ========================================

      for (const product of cart) {
        const productId = product.productId;

        const quantity =
          Number(product.quantity) || 1;

        const availableStock =
          savedStock[productId] !== undefined
            ? Number(savedStock[productId])
            : Number(product.stock);

        console.log(
          "Stock Check:",
          product.name,
          "Available:",
          availableStock,
          "Required:",
          quantity
        );

        if (availableStock <= 0) {
          alert(`${product.name} is out of stock`);
          return;
        }

        if (availableStock < quantity) {
          alert(
            `Only ${availableStock} stock available for ${product.name}`
          );
          return;
        }
      }

      // ========================================
      // CREATE ORDER PRODUCTS
      // ========================================

      const orderProducts = cart.map(
        (product) => ({
          id: product.productId,
          name: product.name,
          image: product.image,
          price: Number(product.price),
          quantity: Number(product.quantity || 1),
          stock: Number(product.stock),
        })
      );

      // ========================================
      // CREATE ORDER DATA
      // ========================================

      const order = {
        id: Date.now(),
        userId: userId,
        products: orderProducts,
        total: totalPrice,
        paymentMethod: paymentMethod,
        date: new Date().toLocaleDateString("en-IN"),
        status: "Order Placed",
        stockRestored: false,
      };

      console.log("Sending order:", order);

      // ========================================
      // SAVE ORDER TO MONGODB
      // ========================================

      const orderResponse = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(order),
        }
      );

      const orderData =
        await orderResponse.json();

      console.log(
        "Order API response:",
        orderData
      );

      // ========================================
      // ORDER FAILED
      // ========================================

      if (!orderResponse.ok) {
        if (orderResponse.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        alert(
          orderData.message ||
            "Failed to place order"
        );

        return;
      }

      console.log(
        "Order saved successfully:",
        orderData.order
      );

      // ========================================
      // DECREASE STOCK
      // ONLY AFTER ORDER SUCCESS
      // ========================================

      cart.forEach((product) => {
        const productId =
          product.productId;

        const quantity =
          Number(product.quantity) || 1;

        const availableStock =
          savedStock[productId] !== undefined
            ? Number(savedStock[productId])
            : Number(product.stock);

        const newStock =
          availableStock - quantity;

        savedStock[productId] = newStock;

        console.log(
          `Stock updated: ${product.name} → ${newStock}`
        );
      });

      // Save updated stock
      localStorage.setItem(
        "productStock",
        JSON.stringify(savedStock)
      );

      console.log(
        "Product stock updated successfully"
      );

      // ========================================
      // CLEAR BACKEND CART
      // ========================================

      const clearCartResponse =
        await fetch(
          "http://localhost:5000/api/cart",
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const clearCartData =
        await clearCartResponse.json();

      console.log(
        "Clear cart response:",
        clearCartData
      );

      if (!clearCartResponse.ok) {
        console.log(
          "Cart clear failed:",
          clearCartData
        );
      }

      // ========================================
      // SAVE LATEST ORDER
      // ========================================

      localStorage.setItem(
        "latestOrder",
        JSON.stringify(
          orderData.order || order
        )
      );

      // ========================================
      // CLEAN OLD LOCAL CART
      // ========================================

      localStorage.removeItem(
        `cart_${userId}`
      );

      localStorage.removeItem(
        "checkoutCart"
      );

      // ========================================
      // CLEAR CURRENT CART STATE
      // ========================================

      setCart([]);

      // ========================================
      // ORDER SUCCESS
      // ========================================

      alert("Order placed successfully!");

      navigate("/order-success");
    } catch (error) {
      console.log(
        "Place order error:",
        error
      );

      alert(
        "Order could not be placed. Please check your backend server."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="payment-page bg-black text-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div
            className="spinner-border text-warning mb-3"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h5 className="text-warning">
            Loading your order...
          </h5>
        </div>
      </main>
    );
  }

  // ==========================================
  // PAYMENT PAGE
  // ==========================================

  return (
    <main className="payment-page bg-black text-white min-vh-100 py-4 py-md-5">

      <div className="container">

        {/* PAGE TITLE */}

        <div className="text-center mb-4 mb-md-5">
          <h2 className="payment-title fw-bold">
            Payment
          </h2>

          <p className="text-secondary mb-0">
            Choose your preferred payment method
          </p>
        </div>

        <div className="row g-4">

          {/* PAYMENT METHODS */}

          <div className="col-12 col-lg-7">

            <div className="payment-card bg-dark border border-warning rounded-4 shadow-lg p-4">

              <div className="d-flex align-items-center mb-4">
                <span className="step-number me-3">
                  1
                </span>

                <div>
                  <h4 className="mb-1 fw-bold">
                    Select Payment Method
                  </h4>

                  <small className="text-secondary">
                    Choose how you want to pay
                  </small>
                </div>
              </div>

              {/* UPI */}

              <label
                className={`payment-option d-flex align-items-center gap-3 p-3 rounded-3 mb-3 ${
                  paymentMethod === "UPI"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    paymentMethod === "UPI"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  className="form-check-input"
                />

                <div>
                  <div className="fw-bold">
                    UPI
                  </div>

                  <small className="text-secondary">
                    Google Pay, PhonePe, Paytm etc.
                  </small>
                </div>
              </label>

              {/* CARD */}

              <label
                className={`payment-option d-flex align-items-center gap-3 p-3 rounded-3 mb-3 ${
                  paymentMethod ===
                  "Credit / Debit Card"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Credit / Debit Card"
                  checked={
                    paymentMethod ===
                    "Credit / Debit Card"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  className="form-check-input"
                />

                <div>
                  <div className="fw-bold">
                    Credit / Debit Card
                  </div>

                  <small className="text-secondary">
                    Visa, Mastercard and other cards
                  </small>
                </div>
              </label>

              {/* COD */}

              <label
                className={`payment-option d-flex align-items-center gap-3 p-3 rounded-3 mb-4 ${
                  paymentMethod ===
                  "Cash on Delivery"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  className="form-check-input"
                />

                <div>
                  <div className="fw-bold">
                    Cash on Delivery
                  </div>

                  <small className="text-secondary">
                    Pay when your order arrives
                  </small>
                </div>
              </label>

              {/* PLACE ORDER */}

              <button
                type="button"
                className="btn btn-warning w-100 fw-bold py-3 place-order-btn"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>

                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <div className="col-12 col-lg-5">

            <div className="payment-card summary-card bg-dark border border-warning rounded-4 shadow-lg p-4">

              <div className="d-flex align-items-center mb-4">
                <span className="step-number me-3">
                  2
                </span>

                <div>
                  <h4 className="mb-1 fw-bold">
                    Order Summary
                  </h4>

                  <small className="text-secondary">
                    {cart.length} item
                    {cart.length !== 1
                      ? "s"
                      : ""}
                  </small>
                </div>
              </div>

              {/* PRODUCTS */}

              <div className="payment-products">

                {cart.map((product) => {

                  const productId =
                    product.productId ||
                    product.id ||
                    product._id;

                  const quantity =
                    product.quantity || 1;

                  const itemTotal =
                    product.price *
                    quantity;

                  return (
                    <div
                      className="payment-product d-flex justify-content-between align-items-center gap-3 py-3 border-bottom border-secondary"
                      key={productId}
                    >
                      <div className="d-flex align-items-center gap-3">

                        <div className="payment-product-image-wrapper">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="payment-product-image"
                          />
                        </div>

                        <div>
                          <p className="mb-1 fw-semibold product-name">
                            {product.name}
                          </p>

                          <small className="text-secondary">
                            Qty: {quantity}
                          </small>
                        </div>

                      </div>

                      <span className="text-warning fw-bold text-nowrap">
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  );
                })}

              </div>

              {/* TOTAL */}

              <div className="d-flex justify-content-between align-items-center pt-4">
                <h5 className="mb-0 fw-bold">
                  Total
                </h5>

                <h3 className="mb-0 text-warning fw-bold">
                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}
                </h3>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Payment;