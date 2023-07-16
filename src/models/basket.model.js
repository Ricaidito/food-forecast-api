const mongoose = require("mongoose");

const basketProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

const basicBasketSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    productsAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    products: [basketProductSchema],
    extractionDate: { type: Date, required: true },
    origin: { type: String, required: true },
  },
  { collection: "baskets" }
);

const BasicBasket = mongoose.model("BasicBasket", basicBasketSchema);

module.exports = BasicBasket;
