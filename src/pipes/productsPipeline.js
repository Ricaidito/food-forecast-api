const Product = require("../models/product.model");

// TODO: Optimize this pipeline to be faster
const getProductsPipeline = async (page, limit) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "prices",
          localField: "productUrl",
          foreignField: "productUrl",
          as: "priceHistory",
        },
      },
      { $unwind: "$priceHistory" },
      { $sort: { "priceHistory.date": -1 } },
      {
        $group: {
          _id: "$_id",
          productName: { $first: "$productName" },
          category: { $first: "$category" },
          imageUrl: { $first: "$imageUrl" },
          productUrl: { $first: "$productUrl" },
          origin: { $first: "$origin" },
          extractionDate: { $first: "$extractionDate" },
          priceHistory: { $push: "$priceHistory" },
        },
      },
      { $sort: { productName: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const products = await Product.aggregate(pipeline);
    return products;
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw error;
  }
};

module.exports = {
  getProductsPipeline,
};
