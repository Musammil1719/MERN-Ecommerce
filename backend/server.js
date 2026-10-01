const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

// ===============================
// MODELS & ROUTES
// ===============================

const User = require("./models/User");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");

const authMiddleware = require("./Middleware/authMiddleware");

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// JWT SECRET
// ===============================

const JWT_SECRET = "my_ecommerce_secret_key";

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect("mongodb://localhost:27017/ecommerceDB")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error);
  });

// ===============================
// PRODUCT ROUTES
// ===============================

app.use("/api/products", productRoutes);

// ===============================
// TEST CANCEL ROUTE
// ===============================

app.put("/api/test-cancel/:id", (req, res) => {
  console.log("🔥 TEST CANCEL ROUTE HIT");
  console.log("ID:", req.params.id);

  res.status(200).json({
    message: "Test cancel route working",
    id: req.params.id,
  });
});

// ===============================
// ORDER ROUTES
// ===============================

app.use("/api/orders", orderRoutes);

// ===============================
// CART ROUTES
// ===============================

app.use("/api/cart", cartRoutes);

// ===============================
// SIGNUP
// ===============================

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await user.save();

    console.log("New user created:", user._id.toString());

    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// LOGIN
// ===============================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("========== LOGIN REQUEST ==========");
    console.log("Login email:", email);
    console.log("Password received:", password ? "YES" : "NO");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const loginEmail = email.trim().toLowerCase();

    // ===============================
    // ADMIN LOGIN
    // ===============================

    const adminEmail = "admin1719@gmail.com";
    const adminPassword = "171819";

    if (loginEmail === adminEmail && password === adminPassword) {
      console.log("Admin login successful");

      return res.status(200).json({
        message: "Admin login successful!",
        admin: true,
      });
    }

    // ===============================
    // FIND USER
    // ===============================

    const user = await User.findOne({
      email: loginEmail,
    });

    console.log("User found:", user ? user._id.toString() : "No user");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ===============================
    // CHECK PASSWORD
    // ===============================

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ===============================
    // CREATE JWT TOKEN
    // ===============================

    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    console.log("JWT token generated successfully");

    // ===============================
    // LOGIN SUCCESS
    // ===============================

    return res.status(200).json({
      message: "Login successful!",
      admin: false,
      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ===============================
// PROTECTED PROFILE
// ===============================

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Protected profile accessed successfully",
      user,
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// GET ALL USERS
// ===============================

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.log("USERS ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("E-commerce Backend Running");
});

// ===============================
// 404 ROUTE
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((error, req, res, next) => {
  console.log("GLOBAL SERVER ERROR:", error);

  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
});

// ===============================
// SERVER
// ===============================

const PORT = 5000;

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
