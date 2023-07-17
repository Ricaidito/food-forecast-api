const Price = require("../models/price.model");

const getPriceHistory = async (req, res) => {
  const productUrl = req.params.productUrl;
  const priceHistory = await Price.find({ productUrl: productUrl }).sort({
    date: -1,
  });

  if (priceHistory) res.status(200).json(priceHistory);
  else res.status(404).json({ error: "Price history not found" });
};

module.exports = {
  getPriceHistory,
};
