const Product = require("../models/product.model");
const Price = require("../models/price.model");
const productPipeline = require("../pipes/products.pipeline");

const getProducts = async (req, res) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  if (isNaN(page) || page <= 0) {
    page = 1;
  }
  if (isNaN(limit) || limit <= 0) {
    limit = 10;
  }

  Product.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .then(products => res.status(200).json(products))
    .catch(err => res.status(500).json({ error: err }));
};

const getProductsWithPriceHistory = async (req, res) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  if (isNaN(page) || page <= 0) {
    page = 1;
  }
  if (isNaN(limit) || limit <= 0) {
    limit = 10;
  }

  try {
    const products = await productPipeline.getProductsPipeline(page, limit);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (product) res.status(200).json(product);
  else res.status(404).json({ error: "Product not found" });
};

const getProductByIdWithPriceHistory = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (product) {
    const priceHistory = await Price.find({ productUrl: product.productUrl });
    res.status(200).json({ product, priceHistory });
  } else res.status(404).json({ error: "Product not found" });
};

module.exports = {
  getProducts,
  getProductsWithPriceHistory,
  getProductById,
  getProductByIdWithPriceHistory,
};
