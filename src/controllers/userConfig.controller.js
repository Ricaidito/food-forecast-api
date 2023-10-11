const UserConfig = require("../models/userConfig.model");
const Product = require("../models/product.model");

const getUserConfig = async (req, res) => {
  const userId = req.params.userId;
  const userConfig = await UserConfig.findOne({ userId: userId });

  if (!userConfig) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.status(200).json(userConfig);
};

const addProductToWatchList = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const userConfig = await UserConfig.findOne({ userId: userId });

  if (!userConfig.watchList.includes(productId)) {
    userConfig.watchList.push(productId);
    await userConfig.save();
  }

  res.status(200).json(userConfig);
};

const removeProductFromWatchList = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const userConfig = await UserConfig.findOne({ userId: userId });

  if (!userConfig.watchList.includes(productId)) {
    res.status(400).json({ error: "Product not found in watch list." });
    return;
  }

  userConfig.watchList = userConfig.watchList.filter(
    product => product !== productId
  );
  await userConfig.save();

  res.status(200).json(userConfig);
};

const clearWatchList = async (req, res) => {
  const userId = req.params.userId;

  const userConfig = await UserConfig.findOne({ userId: userId });

  userConfig.watchList = [];
  await userConfig.save();

  res.status(200).json(userConfig);
};

const updateNotificationThreshold = async (req, res) => {
  const userId = req.params.userId;
  const newThreshold = req.body.newThreshold;

  const userConfig = await UserConfig.findOne({ userId: userId });
  userConfig.notificationThreshold = newThreshold;
  await userConfig.save();

  res.status(200).json(userConfig);
};

const getWatchlistProductInfo = async (req, res) => {
  const productsIds = req.body.productsIds;
  const products = await Product.find({ _id: { $in: productsIds } });
  res.status(200).json(products);
};

module.exports = {
  getUserConfig,
  addProductToWatchList,
  removeProductFromWatchList,
  clearWatchList,
  updateNotificationThreshold,
  getWatchlistProductInfo,
};
