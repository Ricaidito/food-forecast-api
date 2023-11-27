const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const cron = require("node-cron");

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
const priceDropsRoutes = require("./src/routes/priceDrops.routes");
const reportsRoutes = require("./src/routes/reports.routes");

// Services
// const notificationsService = require("./src/utils/notificationsService");

const app = express();
const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

// Database connection
mongoose
  .connect(MONGO_URL, {
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
app.use("/price-drops", priceDropsRoutes);
app.use("/reports", reportsRoutes);

app.listen(PORT, () => {
  console.log(`[Listening on ${HOST}:${PORT}]`);
  // Run the task every Friday at 4:00 PM AST
  // cron.schedule(
  //   "0 16 * * 5",
  //   () => {
  //     console.log(
  //       "[INFO] Running the notification check every Friday at 4:00 PM AST"
  //     );
  //     notificationsService.sendPriceDropNotifications().catch(err => {
  //       console.error(
  //         "[ERROR] There was an error sending price drop notifications:",
  //         err
  //       );
  //     });
  //   },
  //   {
  //     scheduled: true,
  //     timezone: "America/Puerto_Rico",
  //   }
  // );
});
