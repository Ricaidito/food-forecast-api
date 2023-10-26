const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
env.config();

// Routes
const basketRoutes = require("./src/routes/basket.routes");
const productRoutes = require("./src/routes/product.routes");
const userRoutes = require("./src/routes/user.routes");
const userProductRoutes = require("./src/routes/userProduct.routes");
const priceRoutes = require("./src/routes/price.routes");
const userConfigRoutes = require("./src/routes/userConfig.routes");
const paymentRoutes = require("./src/routes/payments.routes");

const app = express();
const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 8000;
const mongoURL = process.env.MONGO_URL;

// Database connection
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("[Connected to database]");
  })
  .catch(err => {
    console.log("[Database connection failed]:", err);
  });

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
app.use(cors());

// Routes
app.use("/baskets", basketRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/user-products", userProductRoutes);
app.use("/prices", priceRoutes);
app.use("/user-config", userConfigRoutes);
app.use("/payments", paymentRoutes);

app.listen(port, () => {
  console.log(`[Listening on ${host}:${port}]`);
});
