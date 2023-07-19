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
    const productId1 = req.params.productId1;
    const productId2 = req.params.productId2;

    const product1 = await Product.findOne({
      $or: [{ _id: productId1 }, { productName: productId1 }],
    });
    const product2 = await Product.findOne({
      $or: [{ _id: productId2 }, { productName: productId2 }],
    });

    if (!product1 || !product2) {
      return res.status(404).json({ error: "One or both products not found" });
    }

    const prices1 = await Price.find({ productUrl: product1.productUrl }).sort({
      date: "asc",
    });
    const prices2 = await Price.find({ productUrl: product2.productUrl }).sort({
      date: "asc",
    });

    if (prices1.length === 0 || prices2.length === 0) {
      return res
        .status(404)
        .json({ error: "No prices found for one or both products" });
    }

    const response = {
      product1: {
        _id: product1._id,
        productName: product1.productName,
        category: product1.category,
        imageUrl: product1.imageUrl,
        productUrl: product1.productUrl,
        origin: product1.origin,
        extractionDate: product1.extractionDate,
      },
      prices1: prices1.map(price => ({
        _id: price._id,
        productPrice: price.productPrice,
        date: price.date,
      })),
      product2: {
        _id: product2._id,
        productName: product2.productName,
        category: product2.category,
        imageUrl: product2.imageUrl,
        productUrl: product2.productUrl,
        origin: product2.origin,
        extractionDate: product2.extractionDate,
      },
      prices2: prices2.map(price => ({
        _id: price._id,
        productPrice: price.productPrice,
        date: price.date,
      })),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getPriceHistory,
  compareProductPrices,
};
