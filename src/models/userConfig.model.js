const mongoose = require("mongoose");

const userConfigSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    hasSubscription: { type: Boolean, default: false, required: false },
    watchList: { type: [String], default: [], required: false },
    notificationThreshold: { type: Number, default: 10, required: false },
  },
  { collection: "userConfigs", versionKey: false }
);

const UserConfig = mongoose.model("UserConfig", userConfigSchema);

module.exports = UserConfig;
