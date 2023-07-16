const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const basketRoutes = require("./src/routes/basket.routes");
const productRoutes = require("./src/routes/products.routes");

const app = express();
const port = process.env.PORT || 8000;
const mongoURL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/foodforecast";

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(err => {
    console.log("Database connection failed:", err);
  });

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/baskets", basketRoutes);
app.use("/products", productRoutes);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
