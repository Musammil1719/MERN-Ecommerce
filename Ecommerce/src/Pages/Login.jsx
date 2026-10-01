
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        alert(data.message || "Invalid email or password");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Admin Login
      if (data.admin === true) {
        localStorage.setItem("isAdminLoggedIn", "true");

        alert("Admin Login Successful!");
        navigate("/admin");
        return;
      }

      const user = data.user;

      if (!user) {
        alert("User information not found");
        return;
      }

      const loggedUserId = user.id || user._id;

      if (!loggedUserId) {
        alert("User ID not found");
        return;
      }

      // Store MongoDB user ID internally
      login(loggedUserId);

      // Store user information for Navbar
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: loggedUserId,
          name: user.name,
          email: user.email,
        })
      );

      window.dispatchEvent(new Event("authChanged"));

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.log("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <main className="login-page bg-black text-white min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="card login-card bg-dark text-white border-warning shadow-lg">
              <div className="card-body p-4 p-md-5">

                {/* Heading */}
                <div className="text-center mb-4">
                  <div className="login-icon mx-auto mb-3">
                    <i className="bi bi-person-fill"></i>
                  </div>

                  <h2 className="fw-bold text-warning mb-2">
                    Welcome Back
                  </h2>

                  <p className="text-secondary mb-0">
                    Login to your account
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  {/* Email */}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold text-warning"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      className="form-control login-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold text-warning"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      className="form-control login-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-warning w-100 fw-bold login-btn py-2"
                  >
                    Login
                  </button>
                </form>

                {/* Signup */}
                <div className="text-center mt-4">
                  <p className="text-secondary mb-0">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-warning fw-semibold text-decoration-none signup-link"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;

