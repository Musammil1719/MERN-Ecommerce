import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const { userId, isLoggedIn } = useAuth();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ==============================
  // LOAD CART FROM BACKEND
  // ==============================

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

        console.log("Checkout cart response:", data);

        if (!response.ok) {
          console.log(
            "Checkout cart fetch failed:",
            data
          );
          setCart([]);
          return;
        }

        setCart(data.items || []);
      } catch (error) {
        console.log("Checkout cart error:", error);
        setCart([]);
      }
    };

    fetchCart();
  }, [isLoggedIn, userId]);

  // ==============================
  // TOTAL PRICE
  // ==============================

  const totalPrice = cart.reduce(
    (total, product) =>
      total +
      product.price * (product.quantity || 1),
    0
  );

  // ==============================
  // ADDRESS INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // CONTINUE TO PAYMENT
  // ==============================

  const handleContinue = (e) => {
    e.preventDefault();

    // Login check
    if (!isLoggedIn || !userId) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    // Cart check
    if (cart.length === 0) {
      alert("Your cart is empty");
      navigate("/cart");
      return;
    }

    // Address validation
    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      alert("Please fill all address details");
      return;
    }

    // Save Delivery Address
    localStorage.setItem(
      "deliveryAddress",
      JSON.stringify(address)
    );

    // Save Checkout Cart
    localStorage.setItem(
      "checkoutCart",
      JSON.stringify(cart)
    );

    // Go To Payment
    navigate("/payment");
  };

  return (
    <main className="checkout-page bg-black text-white min-vh-100 py-4 py-md-5">

      <div className="container">

        {/* Page Heading */}
        <div className="text-center mb-4 mb-md-5">

          <p className="text-warning fw-semibold mb-2">
            SECURE CHECKOUT
          </p>

          <h2 className="fw-bold">
            Checkout
          </h2>

        </div>

        <div className="row g-4">

          {/* ==============================
              DELIVERY ADDRESS
          ============================== */}

          <div className="col-12 col-lg-7">

            <div className="card checkout-card bg-dark text-white border-warning h-100">

              <div className="card-body p-4 p-md-5">

                <h4 className="text-warning fw-bold mb-4">
                  <span className="checkout-step">1</span>
                  Delivery Address
                </h4>

                <form onSubmit={handleContinue}>

                  {/* Full Name */}
                  <div className="mb-3">

                    <label
                      htmlFor="name"
                      className="form-label fw-semibold"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="form-control checkout-input"
                      placeholder="Enter your full name"
                      value={address.name}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Mobile Number */}
                  <div className="mb-3">

                    <label
                      htmlFor="phone"
                      className="form-label fw-semibold"
                    >
                      Mobile Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      className="form-control checkout-input"
                      placeholder="Enter mobile number"
                      value={address.phone}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Address */}
                  <div className="mb-3">

                    <label
                      htmlFor="address"
                      className="form-label fw-semibold"
                    >
                      Full Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      className="form-control checkout-input"
                      rows="4"
                      placeholder="Enter your complete address"
                      value={address.address}
                      onChange={handleChange}
                    />

                  </div>

                  {/* City + State */}
                  <div className="row g-3">

                    <div className="col-12 col-md-6">

                      <label
                        htmlFor="city"
                        className="form-label fw-semibold"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        type="text"
                        name="city"
                        className="form-control checkout-input"
                        placeholder="City"
                        value={address.city}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="col-12 col-md-6">

                      <label
                        htmlFor="state"
                        className="form-label fw-semibold"
                      >
                        State
                      </label>

                      <input
                        id="state"
                        type="text"
                        name="state"
                        className="form-control checkout-input"
                        placeholder="State"
                        value={address.state}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                  {/* Pincode */}
                  <div className="mt-3 mb-4">

                    <label
                      htmlFor="pincode"
                      className="form-label fw-semibold"
                    >
                      Pincode
                    </label>

                    <input
                      id="pincode"
                      type="text"
                      name="pincode"
                      className="form-control checkout-input"
                      placeholder="Enter pincode"
                      value={address.pincode}
                      onChange={handleChange}
                    />

                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100 fw-bold py-3"
                  >
                    Continue to Payment
                  </button>

                </form>

              </div>

            </div>

          </div>

          {/* ==============================
              ORDER SUMMARY
          ============================== */}

          <div className="col-12 col-lg-5">

            <div className="card checkout-summary bg-dark text-white border-warning">

              <div className="card-body p-4 p-md-5">

                <h4 className="text-warning fw-bold mb-4">
                  <span className="checkout-step">2</span>
                  Order Summary
                </h4>

                {/* Products */}
                <div className="checkout-products">

                  {cart.map((product) => {

                    const productId =
                      product.productId ||
                      product.id ||
                      product._id;

                    const quantity =
                      product.quantity || 1;

                    return (
                      <div
                        className="checkout-product d-flex gap-3 mb-3 pb-3 border-bottom border-secondary"
                        key={productId}
                      >

                        <div className="checkout-product-image">
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        </div>

                        <div className="flex-grow-1">

                          <h6 className="fw-bold mb-2">
                            {product.name}
                          </h6>

                          <p className="text-secondary mb-1">
                            Qty: {quantity}
                          </p>

                          <p className="text-warning fw-semibold mb-0">
                            ₹
                            {(
                              product.price * quantity
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* Total */}
                <div className="checkout-total pt-3">

                  <div className="d-flex justify-content-between align-items-center">

                    <span className="fw-bold">
                      Total
                    </span>

                    <span className="text-warning fw-bold fs-4">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Checkout;

