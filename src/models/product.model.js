const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    productUrl: { type: String, required: true },
    origin: { type: String, required: true },
    extractionDate: { type: Date, required: true },
  },
  { collection: "products" }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
