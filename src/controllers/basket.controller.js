const BasicBasket = require("../models/basket.model");

const getLatestBasket = (req, res) => {
  BasicBasket.findOne()
    .sort({ extractionDate: -1 })
    .then(basket => res.status(200).json(basket))
    .catch(err => res.status(500).json("error: " + err));
};

module.exports = {
  getLatestBasket,
};
