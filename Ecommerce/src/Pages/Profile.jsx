
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      if (!loggedInUser) {
        navigate("/login");
        return;
      }

      setUser(loggedInUser);
    } catch (error) {
      console.log("Profile error:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");

    setUser(null);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <main className="profile-page bg-black text-white min-vh-100 py-5">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-12 col-md-8 col-lg-6">

            <div className="card profile-card bg-dark text-white border-warning shadow-lg">

              {/* Header */}
              <div className="card-header bg-black border-warning text-center py-4">

                <div className="profile-icon mx-auto mb-3">
                  👤
                </div>

                <h2 className="text-warning fw-bold mb-1">
                  My Account
                </h2>

                <p className="text-secondary mb-0">
                  Account Information
                </p>

              </div>

              {/* Account Details */}
              <div className="card-body p-4">

                {/* Name */}
                <div className="account-info mb-3">

                  <span className="account-label">
                    User Name
                  </span>

                  <span className="account-value">
                    {user.name || "N/A"}
                  </span>

                </div>

                {/* User ID */}
                <div className="account-info mb-3">

                  <span className="account-label">
                    User ID
                  </span>

                  <span className="account-value user-id">
                    {user.id || "N/A"}
                  </span>

                </div>

                {/* Email */}
                <div className="account-info mb-4">

                  <span className="account-label">
                    Email
                  </span>

                  <span className="account-value">
                    {user.email || "N/A"}
                  </span>

                </div>

                {/* Logout */}
                <button
                  type="button"
                  className="btn btn-outline-warning w-100 fw-bold py-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;

