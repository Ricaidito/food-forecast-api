const mongoose = require("mongoose");

const userReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    fileName: { type: String, required: true },
    userProducts: [{ type: mongoose.Schema.Types.Mixed }],
    similarProducts: [{ type: mongoose.Schema.Types.Mixed }],
    marketOverview: [{ type: mongoose.Schema.Types.Mixed }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "userReports",
  }
);

const UserReport = mongoose.model("UserReport", userReportSchema);

module.exports = UserReport;
