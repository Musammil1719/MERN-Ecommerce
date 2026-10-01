
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import CategoryProduct from "./Pages/CategoryProduct";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup.jsx";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Payment from "./Pages/Payment";
import OrderSucces from "./Pages/OrderSucces.jsx";
import Orders from "./Pages/Orders";
import SearchProduct from "./Pages/SearchProduct.jsx";
import Admin from "./Pages/Admin.jsx";
import AdminLogin from "./Pages/AdminLogin.jsx";
import OrderDetails from "./Pages/OrderDetails.jsx";
import Profile from "./pages/Profile";
import Footer from "./Components/Footer.jsx";
// import ForgotPassword from "./Pages/Forgorpassword.jsx";

function AppContent() {
  const location = useLocation();

  // Admin page-la Navbar and Footer show panna koodadhu
  const isAdminPage =
    location.pathname === "/admin" || location.pathname === "/admin-login";

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/category/:category" element={<CategoryProduct />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/payment" element={<Payment />} />

        <Route path="/order-success" element={<OrderSucces />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/account" element={<Profile />} />

        <Route path="/search/:searchTerm" element={<SearchProduct />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin" element={<Admin />} />

        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

        <Route path="/order-details" element={<OrderDetails />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

