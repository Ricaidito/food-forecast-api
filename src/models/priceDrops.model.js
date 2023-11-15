const mongoose = require("mongoose");

const priceDropSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    productName: {
      type: String,
      required: true,
    },
    productUrl: {
      type: String,
      required: true,
    },
    priceDifference: {
      type: Number,
      required: true,
    },
    previousPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    priceChangeType: {
      type: String,
      required: true,
      enum: ["rise", "drop"],
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    collection: "priceDrops",
    versionKey: false,
  }
);

const PriceDrop = mongoose.model("PriceDrop", priceDropSchema);

module.exports = PriceDrop;
