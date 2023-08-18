const BasicBasket = require("../models/basket.model");

const getLatestBasket = (req, res) => {
  BasicBasket.findOne()
    .sort({ extractionDate: -1 })
    .then(basket => res.status(200).json(basket))
    .catch(err => res.status(500).json("error: " + err));
};

const getBasketInfo = async (req, res) => {
  try {
    const baskets = await BasicBasket.find()
      .sort({ extractionDate: -1 })
      .limit(2);

    if (!baskets) {
      res.status(404).json("No baskets found");
      return;
    }

    const [currentBasket, previousBasket] = baskets;

    if (!previousBasket) {
      res.status(200).json({
        currentPrice: currentBasket.totalAmount,
        previousPrice: null,
        currentExtractionDate: currentBasket.extractionDate,
        previousExtractionDate: null,
        difference: 0,
        priceDifeferences: [],
      });
      return;
    }

    const productPriceDifferences = [];

    if (currentBasket.products.length == previousBasket.products.length) {
      for (let i = 0; i < currentBasket.products.length; i++) {
        const currentProduct = currentBasket.products[i];
        const previousProduct = previousBasket.products[i];
        if (
          currentProduct.productPrice != previousProduct.productPrice &&
          currentProduct.name == previousProduct.name
        )
          productPriceDifferences.push({
            productName: currentProduct.productName,
            currentPrice: currentProduct.productPrice,
            previousPrice: previousProduct.productPrice,
            difference: +(
              currentProduct.productPrice - previousProduct.productPrice
            ).toFixed(2),
            imageUrl: currentProduct.imageUrl,
          });
      }
    }

    res.status(200).json({
      currentPrice: currentBasket.totalAmount,
      previousPrice: previousBasket.totalAmount,
      currentExtractionDate: currentBasket.extractionDate,
      previousExtractionDate: previousBasket.extractionDate,
      difference: +(
        currentBasket.totalAmount - previousBasket.totalAmount
      ).toFixed(2),
      priceDifeferences: productPriceDifferences,
    });
  } catch (err) {
    res.status(500).json("error: " + err);
  }
};

module.exports = {
  getLatestBasket,
  getBasketInfo,
};
