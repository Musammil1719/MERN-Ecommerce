const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../Middleware/authMiddleware");

console.log("🔥🔥 CART ROUTES FILE LOADED");
console.log("🔥🔥 CART SCHEMA PATHS:", Object.keys(Cart.schema.paths));

const router = express.Router();

// ===============================
// GET USER CART
// ===============================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.log("GET CART ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// ADD / UPDATE CART
// ===============================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, image, price, quantity, stock } = req.body;

    if (
      !productId ||
      !name ||
      !image ||
      price === undefined ||
      quantity === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Product information is required",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({
        productId,
        name,
        image,
        price,
        quantity,
        stock,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.log("ADD CART ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE CART ITEM QUANTITY
// ===============================

router.put("/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Invalid quantity",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      message: "Cart quantity updated",
      cart,
    });
  } catch (error) {
    console.log("UPDATE CART ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// REMOVE CART ITEM
// ===============================

router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// CLEAR CART
// ===============================

router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.log("CLEAR CART ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
