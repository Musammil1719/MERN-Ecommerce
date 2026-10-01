const mongoose = require("mongoose");
const Product = require("./models/product");
const products = require("../Ecommerce/src/data/Product.json");

mongoose
  .connect("mongodb://localhost:27017/ecommerceDB")
  .then(async () => {
    console.log("MongoDB connected");

    // Existing test products remove
    await Product.deleteMany({});

    // Product.json products insert
    await Product.insertMany(products);

    console.log("All products added successfully!");
    console.log("Total products:", products.length);

    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Error:", error);
  });