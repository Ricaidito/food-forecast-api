const PriceDrop = require("../models/priceDrops.model");

const getPriceDrops = (req, res) => {
  const amount = parseInt(req.query.amount) || null;
  PriceDrop.find()
    .sort({ date: -1 })
    .limit(amount)
    .then(priceDrops => {
      res.status(200).json(priceDrops);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

const getPriceDropsOfTheWeek = (req, res) => {
  const startOfWeek = new Date();
  startOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  const startIsoString = startOfWeek.toISOString();
  const endIsoString = endOfWeek.toISOString();

  PriceDrop.find({
    date: {
      $gte: startIsoString,
      $lte: endIsoString,
    },
  })
    .then(priceDrops => {
      res.status(200).json(priceDrops);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  getPriceDrops,
  getPriceDropsOfTheWeek,
};
