const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    customerId: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    paymentMethodId: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { collection: "subscriptions", versionKey: false }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
