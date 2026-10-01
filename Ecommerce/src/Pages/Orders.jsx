import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const { userId, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!isLoggedIn || !userId || !token) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setOrders([]);
          return;
        }

        setOrders(data);
      } catch (error) {
        console.log("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [userId, isLoggedIn]);

  const handleViewDetails = (order) => {
    localStorage.setItem(
      "selectedOrder",
      JSON.stringify(order),
    );

    navigate("/order-details");
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmCancel) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      setCancellingOrderId(orderId);

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to cancel order.");
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "Cancelled",
                stockRestored: true,
              }
            : order,
        ),
      );

      localStorage.setItem(
        "selectedOrder",
        JSON.stringify(data.order),
      );

      alert("Order cancelled successfully.");
    } catch (error) {
      console.log("Cancel order error:", error);
      alert("Something went wrong while cancelling the order.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const statuses = [
    "Order Placed",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <main className="orders-page bg-black text-white min-vh-100 py-4 py-md-5">

      <div className="container">

        {/* PAGE TITLE */}

        <div className="text-center mb-4 mb-md-5">
          <h2 className="orders-title fw-bold mb-2">
            My Orders
          </h2>

          <p className="text-secondary mb-0">
            Track and manage your orders
          </p>
        </div>

        {/* NO ORDERS */}

        {orders.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              <div className="no-orders bg-dark border border-warning rounded-4 text-center p-5">

                <div className="empty-order-icon mb-3">
                  📦
                </div>

                <h3 className="fw-bold">
                  No Orders Yet
                </h3>

                <p className="text-secondary mb-0">
                  You haven't placed any orders yet.
                </p>

              </div>

            </div>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => {

              const currentStatusIndex =
                statuses.indexOf(
                  order.status || "Order Placed",
                );

              const isCancelled =
                order.status === "Cancelled";

              const isDelivered =
                order.status === "Delivered";

              return (
                <div
                  className="order-card bg-dark border border-warning rounded-4 shadow-lg p-3 p-md-4 mb-4"
                  key={order.id || order._id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-header row g-3 align-items-center pb-3 mb-3 border-bottom border-secondary">

                    <div className="col-12 col-sm-6">
                      <small className="text-secondary d-block mb-1">
                        Order ID
                      </small>

                      <strong className="text-warning">
                        #{order.id || order._id}
                      </strong>
                    </div>

                    <div className="col-12 col-sm-6 text-sm-end">
                      <small className="text-secondary d-block mb-1">
                        Status
                      </small>

                      {isCancelled ? (
                        <span className="badge bg-danger px-3 py-2">
                          {order.status}
                        </span>
                      ) : isDelivered ? (
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

                  {/* PRODUCTS */}

                  <div className="order-products">

                    {order.products?.map((product) => (
                      <div
                        className="order-product d-flex align-items-center gap-3 py-3 border-bottom border-secondary"
                        key={
                          product.id ||
                          product._id
                        }
                      >

                        <div className="order-product-image-wrapper">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="order-product-image"
                          />
                        </div>

                        <div className="flex-grow-1">

                          <h5 className="product-name fw-bold mb-2">
                            {product.name}
                          </h5>

                          <p className="text-secondary mb-1">
                            Qty:{" "}
                            {product.quantity || 1}
                          </p>

                          <p className="text-warning fw-bold mb-0">
                            ₹
                            {(
                              product.price *
                              (product.quantity || 1)
                            ).toLocaleString(
                              "en-IN",
                            )}
                          </p>

                        </div>

                      </div>
                    ))}

                  </div>

                  {/* TRACKING */}

                  {!isCancelled && (
                    <div className="tracking-section py-4">

                      <h4 className="fw-bold text-warning mb-4">
                        Order Tracking
                      </h4>

                      <div className="tracking-steps">

                        {statuses.map(
                          (status, index) => {

                            const isActive =
                              index <=
                              currentStatusIndex;

                            return (
                              <div
                                key={status}
                                className="tracking-wrapper"
                              >

                                <div
                                  className={
                                    isActive
                                      ? "tracking-step active"
                                      : "tracking-step"
                                  }
                                >

                                  <div className="tracking-circle">
                                    {isActive
                                      ? "✓"
                                      : index + 1}
                                  </div>

                                  <span>
                                    {status}
                                  </span>

                                </div>

                                {index <
                                  statuses.length -
                                    1 && (
                                  <div
                                    className={
                                      index <
                                      currentStatusIndex
                                        ? "tracking-line active"
                                        : "tracking-line"
                                    }
                                  />
                                )}

                              </div>
                            );
                          },
                        )}

                      </div>

                    </div>
                  )}

                  {/* CANCELLED MESSAGE */}

                  {isCancelled && (
                    <div className="cancelled-message alert alert-danger mt-4 mb-0">
                      ❌ This order has been
                      cancelled.
                    </div>
                  )}

                  {/* ORDER FOOTER */}

                  <div className="order-footer row g-3 align-items-center pt-4 mt-2 border-top border-secondary">

                    <div className="col-12 col-md-7">

                      <p className="text-secondary mb-2">
                        Payment:{" "}
                        <strong className="text-white">
                          {order.paymentMethod}
                        </strong>
                      </p>

                      <p className="text-secondary mb-0">
                        Date:{" "}
                        <strong className="text-white">
                          {order.date}
                        </strong>
                      </p>

                    </div>

                    <div className="col-12 col-md-5 text-md-end">

                      <span className="text-secondary d-block mb-1">
                        Order Total
                      </span>

                      <h3 className="text-warning fw-bold mb-0">
                        ₹
                        {Number(
                          order.total || 0,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </h3>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="order-actions d-flex flex-column flex-sm-row gap-3 mt-4">

                    <button
                      type="button"
                      className="btn btn-outline-warning fw-semibold flex-fill"
                      onClick={() =>
                        handleViewDetails(order)
                      }
                    >
                      🔍 View Order Details
                    </button>

                    {!isCancelled &&
                      !isDelivered && (
                        <button
                          type="button"
                          className="btn btn-outline-danger fw-semibold flex-fill"
                          onClick={() =>
                            handleCancelOrder(
                              order.id,
                            )
                          }
                          disabled={
                            cancellingOrderId ===
                            order.id
                          }
                        >
                          {cancellingOrderId ===
                          order.id ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Cancelling...
                            </>
                          ) : (
                            "❌ Cancel Order"
                          )}
                        </button>
                      )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </main>
  );
}

export default Orders;