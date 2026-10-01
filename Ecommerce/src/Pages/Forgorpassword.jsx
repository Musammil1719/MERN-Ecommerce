// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function ForgotPassword() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setMessage("");
//     setError("");

//     if (!email.trim()) {
//       setError("Please enter your email");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(
//         "http://localhost:5000/api/forgot-password",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: email.trim(),
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Something went wrong");
//         return;
//       }

//       setMessage(data.message || "Email verified successfully");

//       setTimeout(() => {
//         navigate("/reset-password", {
//           state: {
//             email: email.trim(),
//           },
//         });
//       }, 1000);
//     } catch (err) {
//       console.log("Forgot password error:", err);
//       setError("Unable to connect to server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="d-flex justify-content-center align-items-center bg-light"
//       style={{ minHeight: "100vh" }}
//     >
//       <div className="card shadow p-4" style={{ width: "400px" }}>
//         <h2 className="text-center mb-4">Forgot Password</h2>

//         <p className="text-muted text-center">
//           Enter your registered email address
//         </p>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>

//             <input
//               type="email"
//               className="form-control"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {error && (
//             <div className="alert alert-danger">
//               {error}
//             </div>
//           )}

//           {message && (
//             <div className="alert alert-success">
//               {message}
//             </div>
//           )}

//           <button
//             type="submit"
//             className="btn btn-primary w-100"
//             disabled={loading}
//           >
//             {loading ? "Checking..." : "Send Reset Link"}
//           </button>
//         </form>

//         <div className="text-center mt-3">
//           <Link to="/login">← Back to Login</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;