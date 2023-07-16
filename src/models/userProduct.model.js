const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userProductSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    priceHistory: { type: [priceHistorySchema], required: true },
    category: { type: String, required: true },
    productImage: { type: Buffer, required: false },
    origin: { type: String, required: true },
  },
  { collection: "userProducts", versionKey: false }
);

const UserProduct = mongoose.model("UserProduct", userProductSchema);

module.exports = UserProduct;
