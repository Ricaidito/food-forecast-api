const Product = require("../models/product.model");
const PriceDrop = require("../models/priceDrops.model");
const UserConfig = require("../models/userConfig.model");
const User = require("../models/user.model");
const emailService = require("./emailService");

const sendPriceDropNotifications = async () => {
  const startOfWeek = new Date();
  startOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  const startIsoString = startOfWeek.toISOString();
  const endIsoString = endOfWeek.toISOString();

  const recentPriceDrops = await PriceDrop.find({
    date: {
      $gte: startIsoString,
      $lte: endIsoString,
    },
  });

  const productUrlToIdMap = new Map();
  for (const priceDrop of recentPriceDrops) {
    const product = await Product.findOne({ productUrl: priceDrop.productUrl });
    if (product)
      productUrlToIdMap.set(priceDrop.productUrl, product._id.toString());
  }

  const userPriceDropsMap = new Map();

  for (const priceDrop of recentPriceDrops) {
    const productId = productUrlToIdMap.get(priceDrop.productUrl);
    if (!productId) continue;

    const interestedUsers = await UserConfig.find({
      watchList: { $elemMatch: { $eq: productId } },
      // notificationThreshold: { $lte: Math.abs(priceDrop.priceDifference) },
    });

    for (const userConfig of interestedUsers) {
      if (!userPriceDropsMap.has(userConfig.userId.toString()))
        userPriceDropsMap.set(userConfig.userId.toString(), []);
      userPriceDropsMap.get(userConfig.userId.toString()).push(priceDrop);
    }
  }

  for (const [userId, priceDrops] of userPriceDropsMap) {
    const user = await User.findById(userId);
    if (user) {
      emailService.sendProductPriceDropEmail(
        user.email,
        `${user.name} ${user.lastName}`,
        priceDrops
      );
    }
  }
};

module.exports = {
  sendPriceDropNotifications,
};
