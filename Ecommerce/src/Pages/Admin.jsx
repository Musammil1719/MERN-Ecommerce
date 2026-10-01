
import React, { useEffect, useState } from "react";
import "./Admin.css";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [pendingStatuses, setPendingStatuses] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stockInputs, setStockInputs] = useState({});
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    rating: "",
    image: "",
    description: "",
  });

  const isAdminLoggedIn =
    localStorage.getItem("isAdminLoggedIn") === "true";

  if (!isAdminLoggedIn) {
    return <Navigate to="/login" />;
  }

  // =====================================
  // Load Data
  // =====================================

  const loadData = async () => {
    // Products - MongoDB
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        setProducts([]);
        console.log("Failed to load products:", data.message);
      }
    } catch (error) {
      console.log("Failed to load products:", error);
      setProducts([]);
    }

    // Orders - MongoDB
    try {
      const response = await fetch(
        "http://localhost:5000/api/orders"
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Failed to load orders:", error);
      setOrders([]);
    }

    // Users - MongoDB
    try {
      const response = await fetch(
        "http://localhost:5000/api/users"
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log("Failed to load users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // =====================================
  // Add Product
  // =====================================

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewProduct = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        id: Number(newProduct.id),
        name: newProduct.name.trim(),
        category: newProduct.category.trim(),
        brand: newProduct.brand.trim(),
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        rating: Number(newProduct.rating),
        image: newProduct.image.trim(),
        description: newProduct.description.trim(),
      };

      if (
        !productData.id ||
        !productData.name ||
        !productData.category ||
        !productData.brand ||
        !productData.price ||
        productData.stock < 0 ||
        !productData.image
      ) {
        alert("Please fill all required fields");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add product");
        return;
      }

      setProducts((prevProducts) => [
        ...prevProducts,
        data,
      ]);

      setNewProduct({
        id: "",
        name: "",
        category: "",
        brand: "",
        price: "",
        stock: "",
        rating: "",
        image: "",
        description: "",
      });

      setShowAddProductForm(false);

      alert("Product added successfully!");
    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error);
      alert("Something went wrong while adding product");
    }
  };

  // =====================================
  // Update Product Stock
  // =====================================

  const updateProductStock = async (product) => {
    const productId = product.id;

    const newStock = Number(stockInputs[productId]);

    if (!Number.isInteger(newStock) || newStock < 0) {
      alert("Please enter a valid stock value");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: newStock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update stock");
        return;
      }

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.id === productId ? data.product : item
        )
      );

      setStockInputs((prev) => ({
        ...prev,
        [productId]: "",
      }));

      alert("Stock updated successfully!");
    } catch (error) {
      console.log("Error updating stock:", error);
      alert("Something went wrong while updating stock");
    }
  };

  // =====================================
  // Status Change
  // =====================================

  const handleStatusChange = (orderId, newStatus) => {
    setPendingStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  // =====================================
  // Restore Stock
  // =====================================

  const restoreCancelledOrderStock = (order, savedStock) => {
    if (order.stockRestored === true) {
      return savedStock;
    }

    if (!order.products || order.products.length === 0) {
      return savedStock;
    }

    order.products.forEach((product) => {
      const productId = product.id || product._id;

      if (!productId) {
        return;
      }

      const quantity = Number(product.quantity) || 1;

      const currentStock =
        savedStock[productId] !== undefined
          ? Number(savedStock[productId])
          : Number(product.stock || 0);

      savedStock[productId] = currentStock + quantity;
    });

    return savedStock;
  };

  // =====================================
  // Apply Status Changes
  // =====================================

  const applyStatusChanges = async () => {
    if (Object.keys(pendingStatuses).length === 0) {
      alert("No status changes to apply");
      return;
    }

    try {
      const updatedOrders = [...orders];

      for (const order of orders) {
        const newStatus = pendingStatuses[order.id];

        if (!newStatus) {
          continue;
        }

        const response = await fetch(
          `http://localhost:5000/api/orders/${order.id}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.log("Failed to update order:", data);
          alert(data.message || "Failed to update order");
          return;
        }

        const index = updatedOrders.findIndex(
          (item) => item.id === order.id
        );

        if (index !== -1) {
          updatedOrders[index] = data.order;
        }
      }

      setOrders(updatedOrders);

      localStorage.setItem(
        "orders",
        JSON.stringify(updatedOrders)
      );

      setPendingStatuses({});

      alert("Order status updated successfully!");
    } catch (error) {
      console.log("Error updating order status:", error);
      alert("Something went wrong while updating order status");
    }
  };

  // =====================================
  // Dashboard
  // =====================================

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;

  const totalSales = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const recentOrders = orders.slice(0, 5);

  // =====================================
  // Helpers
  // =====================================

  const getCustomerName = (order) => {
    return (
      order.customerName ||
      order.name ||
      order.userName ||
      order.customer ||
      order.email ||
      "Customer"
    );
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  return (
    <div className="admin-container bg-black text-white min-vh-100">

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside className="admin-sidebar bg-dark border-end border-warning">

        <div className="admin-logo-wrapper">
          <h2 className="admin-logo text-warning fw-bold">
            Admin Panel
          </h2>
        </div>

        <nav className="admin-nav d-flex flex-column gap-2">

          <button
            className={`admin-nav-btn ${
              activeMenu === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("dashboard")}
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            className={`admin-nav-btn ${
              activeMenu === "products" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("products")}
          >
            <span>📦</span>
            Products
          </button>

          <button
            className={`admin-nav-btn ${
              activeMenu === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("orders")}
          >
            <span>🛒</span>
            Orders
          </button>

          <button
            className={`admin-nav-btn ${
              activeMenu === "users" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("users")}
          >
            <span>👤</span>
            Users
          </button>

        </nav>
      </aside>

      {/* ================================
          MAIN
      ================================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header bg-dark border-bottom border-secondary">
          <div>
            <h1 className="text-warning fw-bold mb-1">
              {activeMenu === "dashboard" && "Dashboard"}
              {activeMenu === "products" && "Products"}
              {activeMenu === "orders" && "Orders"}
              {activeMenu === "users" && "Users"}
            </h1>

            <p className="text-secondary mb-0">
              Welcome back, Admin 👋
            </p>
          </div>
        </header>

        {/* ================================
            DASHBOARD
        ================================= */}

        {activeMenu === "dashboard" && (
          <section className="dashboard p-3 p-md-4">

            {/* STATS */}

            <div className="row g-3 mb-4">

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="stat-card h-100">
                  <div className="stat-icon">📦</div>

                  <div>
                    <p>Total Products</p>
                    <h2>{totalProducts}</h2>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="stat-card h-100">
                  <div className="stat-icon">🛒</div>

                  <div>
                    <p>Total Orders</p>
                    <h2>{totalOrders}</h2>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="stat-card h-100">
                  <div className="stat-icon">👤</div>

                  <div>
                    <p>Total Users</p>
                    <h2>{totalUsers}</h2>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="stat-card h-100">
                  <div className="stat-icon">💰</div>

                  <div>
                    <p>Total Sales</p>
                    <h2>₹{formatPrice(totalSales)}</h2>
                  </div>
                </div>
              </div>

            </div>

            {/* RECENT ORDERS */}

            <div className="admin-section-card">

              <div className="section-title d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h2 className="text-warning fw-bold mb-0">
                  Recent Orders
                </h2>

                <button
                  className="btn btn-outline-warning"
                  onClick={() => setActiveMenu("orders")}
                >
                  View All
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="empty-box">
                  <h3>No Orders Yet</h3>
                  <p>Customer orders will appear here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table admin-table align-middle mb-0">

                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Payment</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>

                          <td>#{order.id}</td>

                          <td>
                            {getCustomerName(order)}
                          </td>

                          <td>
                            {order.products?.length || 0}
                          </td>

                          <td>
                            {order.paymentMethod || "N/A"}
                          </td>

                          <td>
                            ₹{formatPrice(order.total)}
                          </td>

                          <td>
                            <select
                              className="form-select admin-select"
                              value={
                                pendingStatuses[order.id] ||
                                order.status ||
                                "Order Placed"
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  e.target.value
                                )
                              }
                              disabled={
                                order.status === "Cancelled"
                              }
                            >
                              <option value="Order Placed">
                                Order Placed
                              </option>

                              <option value="Confirmed">
                                Confirmed
                              </option>

                              <option value="Shipped">
                                Shipped
                              </option>

                              <option value="Out for Delivery">
                                Out for Delivery
                              </option>

                              <option value="Delivered">
                                Delivered
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>
                            </select>
                          </td>

                          <td>
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() =>
                                setSelectedOrder(order)
                              }
                            >
                              View Details
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ================================
            PRODUCTS
        ================================= */}

        {activeMenu === "products" && (
          <section className="admin-content p-3 p-md-4">

            <div className="content-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

              <div>
                <h2 className="text-warning fw-bold mb-1">
                  Manage Products
                </h2>

                <p className="text-secondary mb-0">
                  Total Products: {products.length}
                </p>
              </div>

              <button
                className="btn btn-warning fw-bold"
                onClick={() =>
                  setShowAddProductForm(
                    !showAddProductForm
                  )
                }
              >
                {showAddProductForm
                  ? "✕ Close"
                  : "+ Add New Product"}
              </button>

            </div>

            {/* ADD PRODUCT FORM */}

            {showAddProductForm && (
              <div className="add-product-form admin-section-card mb-4">

                <h3 className="text-warning fw-bold mb-4">
                  Add New Product
                </h3>

                <form onSubmit={addNewProduct}>

                  <div className="row g-3">

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Product ID
                      </label>

                      <input
                        type="number"
                        name="id"
                        className="form-control admin-input"
                        value={newProduct.id}
                        onChange={handleNewProductChange}
                        placeholder="Enter product ID"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Product Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control admin-input"
                        value={newProduct.name}
                        onChange={handleNewProductChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Category
                      </label>

                      <input
                        type="text"
                        name="category"
                        className="form-control admin-input"
                        value={newProduct.category}
                        onChange={handleNewProductChange}
                        placeholder="Enter category"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Brand
                      </label>

                      <input
                        type="text"
                        name="brand"
                        className="form-control admin-input"
                        value={newProduct.brand}
                        onChange={handleNewProductChange}
                        placeholder="Enter brand"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Price
                      </label>

                      <input
                        type="number"
                        name="price"
                        min="0"
                        className="form-control admin-input"
                        value={newProduct.price}
                        onChange={handleNewProductChange}
                        placeholder="Enter price"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Stock
                      </label>

                      <input
                        type="number"
                        name="stock"
                        min="0"
                        className="form-control admin-input"
                        value={newProduct.stock}
                        onChange={handleNewProductChange}
                        placeholder="Enter stock"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Rating
                      </label>

                      <input
                        type="number"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        className="form-control admin-input"
                        value={newProduct.rating}
                        onChange={handleNewProductChange}
                        placeholder="0 - 5"
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <label className="form-label text-warning">
                        Image URL
                      </label>

                      <input
                        type="text"
                        name="image"
                        className="form-control admin-input"
                        value={newProduct.image}
                        onChange={handleNewProductChange}
                        placeholder="Enter image URL"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-warning">
                        Description
                      </label>

                      <textarea
                        name="description"
                        className="form-control admin-input"
                        value={newProduct.description}
                        onChange={handleNewProductChange}
                        placeholder="Enter product description"
                        rows="4"
                      />
                    </div>

                  </div>

                  <div className="d-flex gap-2 mt-4 flex-wrap">

                    <button
                      type="submit"
                      className="btn btn-warning fw-bold"
                    >
                      Add Product
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowAddProductForm(false)
                      }
                    >
                      Cancel
                    </button>

                  </div>

                </form>
              </div>
            )}

            {/* PRODUCT TABLE */}

            {products.length === 0 ? (
              <div className="empty-box">
                <h3>No Products Found</h3>
              </div>
            ) : (
              <div className="table-responsive admin-section-card">

                <table className="table admin-table align-middle mb-0">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={
                          product.id || product._id
                        }
                      >

                        <td>
                          #{product.id || product._id}
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-2">

                            <img
                              src={product.image}
                              alt={product.name}
                              className="admin-product-image"
                            />

                            <span className="fw-semibold">
                              {product.name}
                            </span>

                          </div>
                        </td>

                        <td>{product.category}</td>

                        <td>{product.brand}</td>

                        <td>
                          ₹{formatPrice(product.price)}
                        </td>

                        {/* STOCK */}

                        <td>
                          <div className="stock-management">

                            <span className="current-stock">
                              Current:{" "}
                              <strong>
                                {product.stock ?? 0}
                              </strong>
                            </span>

                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm admin-input"
                              value={
                                stockInputs[product.id] ?? ""
                              }
                              onChange={(e) =>
                                setStockInputs(
                                  (prev) => ({
                                    ...prev,
                                    [product.id]:
                                      e.target.value,
                                  })
                                )
                              }
                              placeholder="Enter stock"
                            />

                            <button
                              type="button"
                              className="btn btn-warning btn-sm fw-bold"
                              onClick={() =>
                                updateProductStock(product)
                              }
                            >
                              Update Stock
                            </button>

                          </div>
                        </td>

                        <td>
                          ⭐ {product.rating}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </section>
        )}

        {/* ================================
            ORDERS
        ================================= */}

        {activeMenu === "orders" && (
          <section className="admin-content p-3 p-md-4">

            <div className="content-header mb-4">
              <h2 className="text-warning fw-bold mb-1">
                Manage Orders
              </h2>

              <p className="text-secondary mb-0">
                Total Orders: {orders.length}
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="empty-box">
                <h3>No Orders Yet</h3>
                <p>Customer orders will appear here.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive admin-section-card">

                  <table className="table admin-table align-middle mb-0">

                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Payment</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>

                          <td>#{order.id}</td>

                          <td>
                            {getCustomerName(order)}
                          </td>

                          <td>
                            {order.products?.length || 0}
                          </td>

                          <td>
                            {order.paymentMethod || "N/A"}
                          </td>

                          <td>
                            ₹{formatPrice(order.total)}
                          </td>

                          <td>
                            <select
                              className="form-select admin-select"
                              value={
                                pendingStatuses[order.id] ||
                                order.status ||
                                "Order Placed"
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  e.target.value
                                )
                              }
                              disabled={
                                order.status === "Cancelled"
                              }
                            >
                              <option value="Order Placed">
                                Order Placed
                              </option>

                              <option value="Confirmed">
                                Confirmed
                              </option>

                              <option value="Shipped">
                                Shipped
                              </option>

                              <option value="Out for Delivery">
                                Out for Delivery
                              </option>

                              <option value="Delivered">
                                Delivered
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>
                            </select>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

                <div className="d-flex justify-content-end mt-3">

                  <button
                    className="btn btn-warning fw-bold px-4"
                    onClick={applyStatusChanges}
                  >
                    Apply
                  </button>

                </div>
              </>
            )}
          </section>
        )}

        {/* ================================
            USERS
        ================================= */}

        {activeMenu === "users" && (
          <section className="admin-content p-3 p-md-4">

            <div className="content-header mb-4">

              <h2 className="text-warning fw-bold mb-1">
                Manage Users
              </h2>

              <p className="text-secondary mb-0">
                Total Users: {users.length}
              </p>

            </div>

            {users.length === 0 ? (
              <div className="empty-box">
                <h3>No Users Found</h3>
                <p>Registered users will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive admin-section-card">

                <table className="table admin-table align-middle mb-0">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id || user.id}>

                        <td>
                          #{user._id || user.id}
                        </td>

                        <td>{user.name}</td>

                        <td>{user.email}</td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </section>
        )}

        {/* ================================
            ORDER DETAILS MODAL
        ================================= */}

        {selectedOrder && (
          <div
            className="modal fade show d-block admin-modal-backdrop"
            tabIndex="-1"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="modal-content admin-modal-content">

                <div className="modal-header border-warning">

                  <div>
                    <h2 className="modal-title text-warning fw-bold">
                      Order Details
                    </h2>

                    <p className="text-secondary mb-0">
                      Order #{selectedOrder.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() =>
                      setSelectedOrder(null)
                    }
                  ></button>

                </div>

                <div className="modal-body">

                  {/* ORDER INFO */}

                  <div className="row g-3 mb-4">

                    <div className="col-12 col-md-6">
                      <div className="order-info-box">
                        <span>Customer</span>
                        <strong>
                          {getCustomerName(
                            selectedOrder
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="order-info-box">
                        <span>Payment Method</span>
                        <strong>
                          {selectedOrder.paymentMethod ||
                            "N/A"}
                        </strong>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="order-info-box">
                        <span>Order Date</span>
                        <strong>
                          {selectedOrder.date || "N/A"}
                        </strong>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="order-info-box">
                        <span>Status</span>
                        <strong>
                          {selectedOrder.status ||
                            "Order Placed"}
                        </strong>
                      </div>
                    </div>

                  </div>

                  {/* PRODUCTS */}

                  <div className="admin-order-products">

                    <h3 className="text-warning fw-bold mb-3">
                      Products
                    </h3>

                    {selectedOrder.products?.map(
                      (product) => {
                        const quantity =
                          Number(product.quantity) || 1;

                        const itemTotal =
                          Number(product.price || 0) *
                          quantity;

                        return (
                          <div
                            className="admin-order-product"
                            key={
                              product.id ||
                              product._id
                            }
                          >

                            <img
                              src={product.image}
                              alt={product.name}
                              className="admin-order-product-image"
                            />

                            <div className="admin-order-product-info flex-grow-1">

                              <h4>
                                {product.name}
                              </h4>

                              <p>
                                Quantity: {quantity}
                              </p>

                              <p>
                                Price: ₹
                                {formatPrice(
                                  product.price
                                )}
                              </p>

                            </div>

                            <strong className="text-warning">
                              ₹
                              {formatPrice(
                                itemTotal
                              )}
                            </strong>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* TOTAL */}

                  <div className="admin-order-total d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary">

                    <span>Total Amount</span>

                    <strong>
                      ₹
                      {formatPrice(
                        selectedOrder.total
                      )}
                    </strong>

                  </div>

                </div>

                <div className="modal-footer border-secondary">

                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={() =>
                      setSelectedOrder(null)
                    }
                  >
                    Close
                  </button>

                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;

