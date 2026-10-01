
const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
});

// Get single product by MongoDB _id or custom numeric id
router.get("/:id", async (req, res) => {
  try {
    const requestedId = req.params.id;

    let product = null;

    // MongoDB ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(requestedId)) {
      product = await Product.findById(requestedId);
    }

    // Custom numeric product id
    if (!product && !Number.isNaN(Number(requestedId))) {
      product = await Product.findOne({
        id: Number(requestedId),
      });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("GET SINGLE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
});

// Add a product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);

    const savedProduct = await product.save();

    return res.status(201).json(savedProduct);
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// Update product stock
router.put("/:id/stock", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const stock = Number(req.body.stock);

    console.log("========== UPDATE PRODUCT STOCK ==========");
    console.log("PRODUCT ID:", productId);
    console.log("NEW STOCK:", stock);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (Number.isNaN(stock) || stock < 0) {
      return res.status(400).json({
        message: "Stock must be a valid number greater than or equal to 0",
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        id: productId,
      },
      {
        stock: stock,
      },
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    console.log(
      `Stock updated: ${updatedProduct.name} -> ${updatedProduct.stock}`,
    );

    return res.status(200).json({
      message: "Product stock updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("UPDATE STOCK ERROR:", error);

    return res.status(500).json({
      message: "Failed to update product stock",
      error: error.message,
    });
  }
});

module.exports = router;

