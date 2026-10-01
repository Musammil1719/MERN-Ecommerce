import { Link } from "react-router-dom";
import "./OrderSucces.css";

function OrderSuccess() {
  const order = JSON.parse(
    localStorage.getItem("latestOrder")
  );

  return (
    <main className="order-success-page bg-black text-white min-vh-100 d-flex align-items-center justify-content-center py-5">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-12 col-md-9 col-lg-7 col-xl-6">

            <div className="success-card bg-dark border border-warning rounded-4 shadow-lg text-center p-4 p-md-5">

              {/* SUCCESS ICON */}

              <div className="success-icon mx-auto mb-4">
                ✓
              </div>

              {/* TITLE */}

              <h1 className="success-title fw-bold mb-3">
                Order Placed Successfully!
              </h1>

              <p className="text-secondary mb-4">
                Thank you for shopping with ShopKart.
              </p>

              {/* ORDER DETAILS */}

              {order && (
                <div className="order-info bg-black border border-secondary rounded-3 text-start p-3 p-md-4 mb-4">

                  <div className="order-info-row">
                    <span>Order ID</span>
                    <strong>
                      #{order.id}
                    </strong>
                  </div>

                  <div className="order-info-row">
                    <span>Payment</span>
                    <strong>
                      {order.paymentMethod}
                    </strong>
                  </div>

                  <div className="order-info-row">
                    <span>Total</span>
                    <strong className="text-warning">
                      ₹
                      {Number(
                        order.total || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="order-info-row border-0 pb-0">
                    <span>Status</span>
                    <span className="badge bg-warning text-dark px-3 py-2">
                      {order.status}
                    </span>
                  </div>

                </div>
              )}

              {/* BUTTONS */}

              <div className="success-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center">

                <Link
                  to="/orders"
                  className="btn btn-warning fw-bold px-4 py-3 orders-btn"
                >
                  View My Orders
                </Link>

                <Link
                  to="/"
                  className="btn btn-outline-warning fw-semibold px-4 py-3 shop-btn"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default OrderSuccess;