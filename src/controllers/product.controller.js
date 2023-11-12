const Product = require("../models/product.model");
const Price = require("../models/price.model");

const getProducts = (req, res) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  if (isNaN(page) || page <= 0) page = 1;
  if (isNaN(limit) || limit <= 0) limit = 10;

  const skipAmount = (page - 1) * limit;
  const query = {};
  const { productName, category, origin } = req.query;

  if (productName) query.productName = { $regex: new RegExp(productName, "i") };
  if (category) query.category = category;
  if (origin) query.origin = origin;

  Product.find(query)
    .skip(skipAmount)
    .limit(limit)
    .then(products => res.status(200).json(products))
    .catch(err => res.status(500).json({ error: err }));
};

const getProductById = async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (product) res.status(200).json(product);
  else res.status(404).json({ error: "Product not found" });
};

const getProductByIdWithPriceHistory = async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (product) {
    const priceHistory = await Price.find({ productUrl: product.productUrl });
    res.status(200).json({ product, priceHistory });
  } else res.status(404).json({ error: "Product not found" });
};

const getProductsByIdWithPriceHistory = async (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    res.status(400).json({ error: "Invalid productIds provided" });
    return;
  }

  const productResponse = [];

  for (const productId of productIds) {
    const product = await Product.findById(productId);
    const prices = await Price.find({ productUrl: product.productUrl }).sort({
      date: -1,
    });
    productResponse.push({
      _id: product._id,
      productName: product.productName,
      category: product.category,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      origin: product.origin,
      extractionDate: product.extractionDate,
      priceHistory: prices,
    });
  }

  res.status(200).json({ products: productResponse });
};

const getProductByIdWithPrice = async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  const latestPrice = await Price.findOne({
    productUrl: product.productUrl,
  }).sort({ date: -1 });

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  return res.status(200).json({ productInfo: product, price: latestPrice });
};

module.exports = {
  getProducts,
  getProductById,
  getProductByIdWithPriceHistory,
  getProductsByIdWithPriceHistory,
  getProductByIdWithPrice,
};
