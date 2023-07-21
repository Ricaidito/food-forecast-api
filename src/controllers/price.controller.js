const Price = require("../models/price.model");
const Product = require("../models/product.model");

const getPriceHistory = async (req, res) => {
  const productUrl = req.params.productUrl;
  const priceHistory = await Price.find({ productUrl: productUrl }).sort({
    date: -1,
  });

  if (priceHistory) res.status(200).json(priceHistory);
  else res.status(404).json({ error: "Price history not found" });
};

const compareProductPrices = async (req, res) => {
  try {
    const productIds = req.body.productIds;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "Invalid productIds provided" });
    }

    const products = await Product.find({
      $or: productIds.map(productId => ({ _id: productId })),
    });

    if (products.length !== productIds.length) {
      return res.status(404).json({ error: "One or more products not found" });
    }

    const pricePromises = products.map(product =>
      Price.find({ productUrl: product.productUrl }).sort({ date: "asc" })
    );
    const prices = await Promise.all(pricePromises);

    const response = {};
    products.forEach((product, index) => {
      response[`product${index + 1}`] = {
        _id: product._id,
        productName: product.productName,
        category: product.category,
        imageUrl: product.imageUrl,
        productUrl: product.productUrl,
        origin: product.origin,
        extractionDate: product.extractionDate,
      };
      response[`prices${index + 1}`] = prices[index].map(price => ({
        _id: price._id,
        productPrice: price.productPrice,
        date: price.date,
      }));
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getPriceHistory,
  compareProductPrices,
};
