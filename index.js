const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
