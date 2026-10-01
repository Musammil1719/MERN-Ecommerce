import { useEffect, useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const checkUser = () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      setUser(loggedInUser);
    } catch (error) {
      console.log("User data error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();

    window.addEventListener("storage", checkUser);
    window.addEventListener("authChanged", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("authChanged", checkUser);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() === "") {
      return;
    }

    navigate(`/search/${search}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-warning sticky-top">
      <div className="container-fluid px-3 px-lg-5">
        {/* Logo */}
        <Link to="/" className="navbar-brand fw-bold text-warning fs-3">
          SHOP
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-warning"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#shopNavbar"
          aria-controls="shopNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="shopNavbar">
          {/* Search */}
          <form
            className="d-flex mx-lg-4 my-3 my-lg-0 flex-grow-1"
            onSubmit={handleSearch}
          >
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button type="submit" className="btn btn-warning fw-bold">
                🔍
              </button>
            </div>
          </form>

          {/* Links */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {/* Home */}
            <NavLink
              to="/"
              className={ ({ isActive }) =>
                `nav-link ${isActive ? "active-nav-link" : ""}` 
              }
            >
              🏠︎ Home
            </NavLink>

            {/* Cart */}
            {/* <li className="nav-item">
              <Link to="/cart" className="nav-link text-white fw-semibold">
                🛒 Cart
              </Link>
            </li> */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active-nav-link" : ""}`
              }
            >
              🛒 Cart
            </NavLink>

            {/* NOT LOGGED IN */}
            {!isLoggedIn && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-nav-link" : ""}`
                  }
                >
                 Login
                </NavLink>

                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="btn btn-warning fw-semibold px-3"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {/* LOGGED IN */}
            {isLoggedIn && user && (
              <>
                {/* My Orders */}
                <li className="nav-item">
                  <Link
                    to="/orders"
                    className="nav-link text-white fw-semibold"
                  >
                    My Orders
                  </Link>
                </li>

                {/* My Account */}
                <li className="nav-item">
                  <Link
                    to="/account"
                    className="nav-link text-warning fw-semibold"
                  >
                    👤 My Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
