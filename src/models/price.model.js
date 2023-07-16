const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    productPrice: { type: Number, required: true },
    productUrl: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { collection: "prices" }
);

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
