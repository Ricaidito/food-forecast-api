const sharp = require("sharp");
const UserProduct = require("../models/userProduct.model");

const createUserProduct = async (req, res) => {
  const userId = req.params.userId;
  let imageBuffer = null;

  if (req.file && req.file.mime !== "image/jpeg")
    imageBuffer = await sharp(req.file.buffer).jpeg().toBuffer();

  const userProduct = new UserProduct({
    _id: new mongoose.Types.ObjectId(),
    userId: userId,
    productName: req.body.productName,
    price: req.body.price,
    priceHistory: [{ price: req.body.price }],
    category: req.body.category,
    productImage: imageBuffer,
    origin: req.body.origin,
  });

  userProduct
    .save()
    .then(() => res.status(201).json(user))
    .catch(err => res.status(500).json({ error: err }));
};

const getUserProducts = async (req, res) => {
  const userId = req.params.userId;
  const userProducts = await UserProduct.find({ userId: userId });
  res.status(200).json(userProducts);
};

const getUserProduct = async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const userProduct = await UserProduct.findOne({
    _id: id,
    userId: userId,
  });

  if (!userProduct) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  res.status(200).json(userProduct);
};

const deleteUserProduct = async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const userProduct = await UserProduct.findOneAndDelete({
    _id: id,
    userId: userId,
  });

  if (!userProduct) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  res.status(200).json(userProduct);
};

const updateUserProductPrice = async (req, res) => {
  const { id, userId } = req.params;
  const newPrice = req.body.price;

  const userProduct = await UserProduct.findOne({ _id: id, userId: userId });

  if (!userProduct) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  const priceHistoryEntry = {
    price: userProduct.price,
    date: new Date(),
  };

  userProduct.price = newPrice;
  userProduct.priceHistory.push(priceHistoryEntry);

  userProduct
    .save()
    .then(() => res.status(200).json(userProduct))
    .catch(err => res.status(500).json({ error: err }));
};

const updateUserProductInfo = async (req, res) => {
  const { id, userId } = req.params;
  const { productName, category, origin } = req.body;
  const updatedProduct = await UserProduct.findOneAndUpdate(
    { _id: id, userId: userId },
    { productName, category, origin }
  );

  if (!updatedProduct) {
    res.status(404).json({ error: "User product not found" });
    return;
  }

  res.status(200).json(updatedProduct);
};

module.exports = {
  createUserProduct,
  getUserProducts,
  getUserProduct,
  deleteUserProduct,
  updateUserProductPrice,
  updateUserProductInfo,
};
