const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const basketRoutes = require("./src/routes/basket.routes");
const productRoutes = require("./src/routes/product.routes");
const userRoutes = require("./src/routes/user.routes");
const userProductRoutes = require("./src/routes/userProduct.routes");

const app = express();
const port = process.env.PORT || 8000;
const mongoURL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/foodforecast";

// Database connection
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

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/baskets", basketRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/user-products", userProductRoutes);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
