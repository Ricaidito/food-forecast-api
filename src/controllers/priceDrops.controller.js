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

const getPriceDropsBetweenDates = (req, res) => {
  const { start, end } = req.body;
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: "Invalid dates" });
  }

  const startIsoString = startDate.toISOString();
  const endIsoString = endDate.toISOString();

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
  getPriceDropsBetweenDates,
};
