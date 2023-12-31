const mongoose = require("mongoose");
const sharp = require("sharp");
const UserProduct = require("../models/userProduct.model");
const fileService = require("../utils/fileService");

const getUserProducts = async (req, res) => {
  const userId = req.params.userId;
  const userProducts = await UserProduct.find({ userId: userId });
  res.status(200).json(userProducts);
};

const getUserProductsByIds = async (req, res) => {
  const userId = req.params.userId;
  const userProductsIds = req.body.userProductsIds;
  const userProducts = await UserProduct.find({
    userId: userId,
    _id: { $in: userProductsIds },
  });
  res.status(200).json(userProducts);
};

const getUserProductsByIdsAlterName = async (req, res) => {
  const userId = req.params.userId;
  const userProductsIds = req.body.userProductsIds;
  const userProducts = await UserProduct.find({
    userId: userId,
    _id: { $in: userProductsIds },
  });

  const modifiedUserProducts = userProducts.map(product => {
    const modifiedPriceHistory = product.priceHistory.map(priceEntry => {
      return {
        ...priceEntry._doc,
        productPrice: priceEntry.price,
        price: undefined,
      };
    });

    return { ...product._doc, priceHistory: modifiedPriceHistory };
  });

  res.status(200).json(modifiedUserProducts);
};

const getUserProduct = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.params.userId;
  const userProduct = await UserProduct.findOne({
    _id: productId,
    userId: userId,
  });

  if (!userProduct) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  res.status(200).json(userProduct);
};

const createUserProduct = async (req, res) => {
  const userId = req.params.userId;
  let imageBuffer = null;

  if (req.file) {
    if (req.file.mime !== "image/jpeg")
      imageBuffer = await sharp(req.file.buffer).jpeg().toBuffer();
    else imageBuffer = req.file.buffer;
  } else {
    try {
      imageBuffer = fileService.getDefaultUserProductPicture();
    } catch (err) {
      console.log("Default product picture not found:", err);
    }
  }

  const userProduct = new UserProduct({
    _id: new mongoose.Types.ObjectId(),
    userId: userId,
    productName: req.body.productName,
    price: req.body.price,
    priceHistory: [{ price: req.body.price, date: new Date().toISOString() }],
    category: req.body.category,
    productImage: imageBuffer,
    origin: req.body.origin,
  });

  userProduct
    .save()
    .then(() => res.status(201).json(userProduct))
    .catch(err => res.status(500).json({ error: err }));
};

const createUserProductsFromFile = async (req, res) => {
  const userId = req.params.userId;
  const excelFile = req.file;

  const productFromFile = fileService.parseExcelFile(excelFile.buffer);

  if (!productFromFile) {
    res.status(400).json({ error: "Excel file is not valid" });
    return;
  }

  const userProducts = productFromFile.map(product => ({
    _id: new mongoose.Types.ObjectId(),
    userId: userId,
    productName: product.productName,
    price: product.price,
    priceHistory: [{ price: product.price, date: new Date().toISOString() }],
    category: product.category,
    productImage: fileService.getDefaultUserProductPicture(),
    origin: product.origin,
  }));

  UserProduct.insertMany(userProducts)
    .then(() => res.status(201).json(userProducts))
    .catch(err => res.status(500).json({ error: err }));
};

const updateUserProductInfo = async (req, res) => {
  const { productId, userId } = req.params;
  const { productName, category, origin } = req.body;
  let imageBuffer = null;
  let productToUpdate = null;

  if (req.file) {
    if (req.file.mime !== "image/jpeg")
      imageBuffer = await sharp(req.file.buffer).jpeg().toBuffer();
    else imageBuffer = req.file.buffer;
  }

  if (imageBuffer) {
    productToUpdate = await UserProduct.findOneAndUpdate(
      { _id: productId, userId: userId },
      { productName, category, origin, productImage: imageBuffer }
    );
  } else {
    productToUpdate = await UserProduct.findOneAndUpdate(
      { _id: productId, userId: userId },
      { productName, category, origin }
    );
  }

  if (!productToUpdate) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  const updatedProduct = await UserProduct.findOne({
    _id: productId,
    userId: userId,
  });

  res.status(200).json(updatedProduct);
};

const updateUserProductPrice = async (req, res) => {
  const { productId, userId } = req.params;

  const userProduct = await UserProduct.findOne({
    _id: productId,
    userId: userId,
  });

  if (!userProduct) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  const newDate = new Date(req.body.date);

  const priceHistoryEntry = {
    price: req.body.price,
    date: newDate.toISOString(),
  };

  userProduct.price = req.body.price;
  userProduct.priceHistory.push(priceHistoryEntry);

  userProduct
    .save()
    .then(() => res.status(200).json(userProduct))
    .catch(err => res.status(500).json({ error: err }));
};

const deleteUserProduct = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.params.userId;
  const userProduct = await UserProduct.findOneAndDelete({
    _id: productId,
    userId: userId,
  });

  if (!userProduct) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  res.status(200).json({ message: "User product deleted" });
};

const deleteAllUserProducts = async (req, res) => {
  const userId = req.params.userId;
  const deletedProducts = await UserProduct.deleteMany({ userId: userId });
  res.status(200).json({
    message: `Succesfully deleted: ${deletedProducts.deletedCount} products`,
  });
};

const downloadExcelTemplate = (req, res) => {
  res.download(fileService.getExcelTemplateFilePath());
};

module.exports = {
  createUserProduct,
  createUserProductsFromFile,
  getUserProducts,
  getUserProduct,
  getUserProductsByIds,
  deleteUserProduct,
  updateUserProductPrice,
  updateUserProductInfo,
  deleteAllUserProducts,
  downloadExcelTemplate,
  getUserProductsByIdsAlterName,
};
