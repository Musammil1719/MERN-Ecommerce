const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

// =====================================================
// CREATE ORDER
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user.id,
    };

    console.log("========== CREATE ORDER ==========");
    console.log("USER ID:", req.user.id);
    console.log("ORDER DATA:", orderData);

    // Check products
    if (
      !orderData.products ||
      !Array.isArray(orderData.products) ||
      orderData.products.length === 0
    ) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    // =====================================================
    // CHECK STOCK
    // =====================================================

    for (const item of orderData.products) {
      const product = await Product.findOne({
        id: Number(item.id),
      });

      console.log("CHECKING PRODUCT:", item.id);
      console.log("FOUND PRODUCT:", product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
        });
      }

      const quantity = Number(item.quantity) || 1;

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
        });
      }
    }

    // =====================================================
    // DECREASE PRODUCT STOCK
    // =====================================================

    for (const item of orderData.products) {
      const quantity = Number(item.quantity) || 1;

      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            id: Number(item.id),
            stock: {
              $gte: quantity,
            },
          },
          {
            $inc: {
              stock: -quantity,
            },
          },
          {
            new: true,
          },
        );

      if (!updatedProduct) {
        return res.status(400).json({
          message: `Stock changed for ${item.name}. Please try again.`,
        });
      }

      console.log(
        `Stock updated: ${updatedProduct.name} -> ${updatedProduct.stock}`,
      );
    }

    // =====================================================
    // SAVE ORDER
    // =====================================================

    const order = new Order(orderData);

    const savedOrder = await order.save();

    console.log("ORDER SAVED SUCCESSFULLY:", savedOrder.id);

    return res.status(201).json({
      message: "Order saved successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      message: "Failed to save order",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

router.put("/:id/status", async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    console.log("========== UPDATE ORDER STATUS ==========");
    console.log("ORDER ID:", orderId);
    console.log("NEW STATUS:", status);

    const updatedOrder =
      await Order.findOneAndUpdate(
        {
          id: orderId,
        },
        {
          status: status,
        },
        {
          new: true,
        },
      );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// =====================================================
// CANCEL ORDER - USER
// =====================================================

router.put(
  "/:id/cancel",
  authMiddleware,
  async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      const userId = req.user.id;

      console.log("========== CANCEL ORDER ==========");
      console.log("ORDER ID:", orderId);
      console.log("USER ID:", userId);

      const order = await Order.findOne({
        id: orderId,
        userId: userId,
      });

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      if (order.status === "Cancelled") {
        return res.status(400).json({
          message: "Order is already cancelled",
        });
      }

      if (order.status === "Delivered") {
        return res.status(400).json({
          message: "Delivered orders cannot be cancelled",
        });
      }

      if (order.stockRestored) {
        return res.status(400).json({
          message: "Stock has already been restored for this order",
        });
      }

      // Restore stock
      for (const item of order.products) {
        const quantity =
          Number(item.quantity) || 1;

        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              id: Number(item.id),
            },
            {
              $inc: {
                stock: quantity,
              },
            },
            {
              new: true,
            },
          );

        if (!updatedProduct) {
          return res.status(404).json({
            message: `Product not found: ${item.name}`,
          });
        }

        console.log(
          `Stock restored: ${item.name} -> ${updatedProduct.stock}`,
        );
      }

      order.status = "Cancelled";
      order.stockRestored = true;

      await order.save();

      return res.status(200).json({
        message: "Order cancelled successfully",
        order: order,
      });
    } catch (error) {
      console.log("CANCEL ORDER ERROR:", error);

      return res.status(500).json({
        message: "Failed to cancel order",
        error: error.message,
      });
    }
  },
);

// =====================================================
// GET LOGGED-IN USER ORDERS
// =====================================================

router.get(
  "/user/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const requestedUserId =
        req.params.userId;

      const loggedInUserId =
        req.user.id.toString();

      if (
        requestedUserId !== loggedInUserId
      ) {
        return res.status(403).json({
          message:
            "You can only access your own orders",
        });
      }

      const orders = await Order.find({
        userId: loggedInUserId,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.log(
        "GET USER ORDERS ERROR:",
        error,
      );

      return res.status(500).json({
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  },
);

module.exports = router;