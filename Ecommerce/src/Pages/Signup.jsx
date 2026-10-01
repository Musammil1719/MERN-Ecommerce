
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check all fields
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    // Check password
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Account created successfully!");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Go to login
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Unable to connect to server");
    }
  };

  return (
    <main className="signup-page bg-black text-white min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            <div className="card signup-card bg-dark text-white border-warning shadow-lg">
              <div className="card-body p-4 p-md-5">

                {/* Heading */}
                <div className="text-center mb-4">
                  <div className="signup-icon mx-auto mb-3">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>

                  <h2 className="fw-bold text-warning mb-2">
                    Create Account
                  </h2>

                  <p className="text-secondary mb-0">
                    Join us and start shopping
                  </p>
                </div>

                <form onSubmit={handleSignup}>

                  {/* Name */}
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label fw-semibold text-warning"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      className="form-control signup-input"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

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
                      className="form-control signup-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold text-warning"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      className="form-control signup-input"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold text-warning"
                    >
                      Confirm Password
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      className="form-control signup-input"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                    />
                  </div>

                  {/* Signup Button */}
                  <button
                    type="submit"
                    className="btn btn-warning w-100 fw-bold signup-btn py-2"
                  >
                    Sign Up
                  </button>

                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-secondary mb-0">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-warning fw-semibold text-decoration-none login-link"
                    >
                      Login
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

export default Signup;

