import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedOrder =
      localStorage.getItem("selectedOrder");

    if (!savedOrder) {
      navigate("/orders");
      return;
    }

    try {
      const parsedOrder =
        JSON.parse(savedOrder);

      setOrder(parsedOrder);
    } catch (error) {
      console.log(
        "Failed to load order:",
        error
      );

      navigate("/orders");
    }
  }, [navigate]);

  if (!order) {
    return (
      <main className="order-details-page bg-black text-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div
            className="spinner-border text-warning mb-3"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-secondary mb-0">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page bg-black text-white min-vh-100 py-4 py-md-5">

      <div className="container">

        {/* =========================
            HEADER
        ========================== */}

        <div className="order-details-header bg-dark border border-warning rounded-4 shadow-lg p-4 mb-4">

          <div className="row align-items-center g-3">

            <div className="col-12 col-md-8">

              <h2 className="details-title fw-bold mb-2">
                Order Details
              </h2>

              <p className="text-secondary mb-0">
                Order ID:{" "}
                <strong className="text-warning">
                  #{order.id || order._id}
                </strong>
              </p>

            </div>

            <div className="col-12 col-md-4 text-md-end">

              <span className="text-secondary d-block mb-2">
                Status
              </span>

              {order.status === "Cancelled" ? (
                <span className="badge bg-danger px-3 py-2">
                  {order.status}
                </span>
              ) : order.status === "Delivered" ? (
                <span className="badge bg-success px-3 py-2">
                  {order.status}
                </span>
              ) : (
                <span className="badge bg-warning text-dark px-3 py-2">
                  {order.status ||
                    "Order Placed"}
                </span>
              )}

            </div>

          </div>

        </div>

        {/* =========================
            PRODUCTS
        ========================== */}

        <div className="details-card bg-dark border border-warning rounded-4 shadow-lg p-4 mb-4">

          <h3 className="section-title fw-bold mb-4">
            Products
          </h3>

          {order.products?.map(
            (product) => {

              const quantity =
                Number(
                  product.quantity
                ) || 1;

              const itemTotal =
                Number(
                  product.price
                ) * quantity;

              return (
                <div
                  className="details-product d-flex align-items-center gap-3 py-3 border-bottom border-secondary"
                  key={
                    product.id ||
                    product._id
                  }
                >

                  {/* IMAGE */}

                  <div className="details-product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="details-product-image"
                    />
                  </div>

                  {/* PRODUCT INFO */}

                  <div className="details-product-info flex-grow-1">

                    <h5 className="fw-bold text-white mb-2">
                      {product.name}
                    </h5>

                    <p className="text-secondary mb-1">
                      Quantity:{" "}
                      {quantity}
                    </p>

                    <p className="text-secondary mb-0">
                      Price:{" "}
                      <span className="text-warning">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </p>

                  </div>

                  {/* ITEM TOTAL */}

                  <strong className="text-warning text-nowrap">
                    ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              );
            }
          )}

        </div>

        {/* =========================
            PAYMENT DETAILS
        ========================== */}

        <div className="details-card bg-dark border border-warning rounded-4 shadow-lg p-4 mb-4">

          <h3 className="section-title fw-bold mb-4">
            Payment Details
          </h3>

          <div className="details-row d-flex justify-content-between align-items-center gap-3 py-3 border-bottom border-secondary">
            <span className="text-secondary">
              Payment Method
            </span>

            <strong className="text-white text-end">
              {order.paymentMethod}
            </strong>
          </div>

          <div className="details-row d-flex justify-content-between align-items-center gap-3 py-3 border-bottom border-secondary">
            <span className="text-secondary">
              Order Date
            </span>

            <strong className="text-white text-end">
              {order.date}
            </strong>
          </div>

          <div className="details-row total-row d-flex justify-content-between align-items-center gap-3 pt-4">

            <span className="fw-bold">
              Total Amount
            </span>

            <strong className="text-warning fs-4">
              ₹
              {Number(
                order.total || 0
              ).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        {/* =========================
            STATUS
        ========================== */}

        <div className="details-card bg-dark border border-warning rounded-4 shadow-lg p-4 mb-4">

          <h3 className="section-title fw-bold mb-4">
            Order Status
          </h3>

          <div className="status-display d-flex align-items-center gap-3">

            <span
              className={`status-dot ${
                order.status ===
                "Cancelled"
                  ? "cancelled"
                  : order.status ===
                    "Delivered"
                  ? "delivered"
                  : ""
              }`}
            ></span>

            <strong
              className={
                order.status ===
                "Cancelled"
                  ? "text-color-white"
                  : order.status ===
                    "Delivered"
                  ? "text-success"
                  : "text-warning"
              }
            >
              {order.status ||
                "Order Placed"}
            </strong>

          </div>

        </div>

        {/* =========================
            BACK BUTTON
        ========================== */}

        <div className="text-center">

          <button
            type="button"
            className="btn btn-outline-warning fw-semibold px-4 py-3 back-orders-btn"
            onClick={() =>
              navigate("/orders")
            }
          >
            ← Back to My Orders
          </button>

        </div>

      </div>

    </main>
  );
}

export default OrderDetails;