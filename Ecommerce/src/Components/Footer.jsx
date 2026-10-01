import "./Footer.css";
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
    {/* <div className="back-to-top-section text-center ">
  <button
    className="back-to-top-btn"
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  >
    ↑ Back to Top
  </button>
</div> */}
    <footer className="footer bg-dark text-light ">
      <div className="container py-5">
        <div className="row">

          {/* About */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">MyShop</h5>
            <p className="text-secondary">
              Your one-stop online shopping destination for mobiles,
              electronics, fashion, grocery and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Quick Links</h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none">
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/category/mobiles"
                  className="text-secondary text-decoration-none"
                >
                  Mobiles
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/category/electronics"
                  className="text-secondary text-decoration-none"
                >
                  Electronics
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/category/fashion"
                  className="text-secondary text-decoration-none"
                >
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Customer Service</h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/orders"
                  className="text-secondary text-decoration-none"
                >
                  My Orders
                </Link>
              </li>

              <li className="mb-2">
                <span className="text-secondary">
                  Shipping & Delivery
                </span>
              </li>

              <li className="mb-2">
                <span className="text-secondary">
                  Returns & Refunds
                </span>
              </li>

              <li className="mb-2">
                <span className="text-secondary">
                  Privacy Policy
                </span>
              </li>

              <li className="mb-2">
                <span className="text-secondary">
                  Terms & Conditions
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Contact Us</h5>

            <p className="text-secondary mb-2">
              📧 support@myshop.com
            </p>

            <p className="text-secondary mb-2">
              📞 +91 70920 62301
            </p>

            <p className="text-secondary">
              📍 Tamil Nadu, India
            </p>
          </div>

        </div>

        <hr className="border-secondary" />

        {/* Bottom */}
        <div className="row align-items-center">

          <div className="col-md-6">
            <p className="mb-0 text-secondary">
              © 2026 MyShop. All Rights Reserved.
            </p>
          </div>

          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <span className="text-secondary me-3">
              Instagram
            </span>

            <span className="text-secondary me-3">
              Facebook
            </span>

            <span className="text-secondary">
              YouTube
            </span>
          </div>

        </div>
      </div>
    </footer>
    </>
  );

}


export default Footer;

