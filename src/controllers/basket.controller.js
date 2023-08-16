const BasicBasket = require("../models/basket.model");

const getLatestBasket = (req, res) => {
  BasicBasket.findOne()
    .sort({ extractionDate: -1 })
    .then(basket => res.status(200).json(basket))
    .catch(err => res.status(500).json("error: " + err));
};

// TODO: Add the capability to see which products have increased/decreased in price
const compareBasketsWithPrevious = async (req, res) => {
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
        difference: 0,
      });
      return;
    }

    res.status(200).json({
      currentPrice: currentBasket.totalAmount,
      previousPrice: previousBasket.totalAmount,
      difference: +(
        currentBasket.totalAmount - previousBasket.totalAmount
      ).toFixed(2),
    });
  } catch (err) {
    res.status(500).json("error: " + err);
  }
};

module.exports = {
  getLatestBasket,
  compareBasketsWithPrevious,
};
