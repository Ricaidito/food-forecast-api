const Product = require("../models/product.model");
const Price = require("../models/price.model");
const UserProduct = require("../models/userProduct.model");
const PriceDrop = require("../models/priceDrops.model");
const Basket = require("../models/basket.model");

const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");

const fetchDataForReport = async userId => {
  const [userProducts, similarProducts] = await fetchSimilarProducts(userId);
  const marketOverview = await fetchQuickMarketOverview();
  const priceDrops = await fetchPriceDrops();
  const reportData = {
    userProducts,
    similarProducts,
    marketOverview,
    priceDrops,
  };

  return reportData;
};

const fetchSimilarProducts = async userId => {
  const userProducts = await UserProduct.find({ userId });
  const similarProducts = [];

  for (const userProduct of userProducts) {
    const clonedMarketProducts = [];
    const regexPattern = new RegExp(userProduct.productName, "i");
    const marketProducts = await Product.find({
      productName: { $regex: regexPattern },
      origin: "micmp",
    });

    for (const marketProduct of marketProducts) {
      const marketPrice = await Price.find({
        productUrl: marketProduct.productUrl,
      })
        .sort({ date: -1 })
        .limit(1);

      if (marketPrice.length > 0) {
        clonedMarketProducts.push({
          ...marketProduct._doc,
          price: marketPrice[0].productPrice,
        });
      }
    }

    similarProducts.push({
      productName: userProduct.productName,
      userPrice: userProduct.price,
      similar: clonedMarketProducts,
      category: userProduct.category,
    });
  }

  return [userProducts, similarProducts];
};

const fetchQuickMarketOverview = async () => {
  const { products } = await Basket.findOne().sort({ extractionDate: -1 });
  return products;
};

const fetchPriceDrops = async () => {
  const startOfWeek = new Date();
  startOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  const startIsoString = startOfWeek.toISOString();
  const endIsoString = endOfWeek.toISOString();

  const priceDrops = await PriceDrop.find({
    date: {
      $gte: startIsoString,
      $lte: endIsoString,
    },
  });

  return priceDrops;
};

const generatePDFReport = reportData => {
  const fonts = {
    Roboto: {
      normal: "src/fonts/Roboto-Regular.ttf",
      bold: "src/fonts/Roboto-Medium.ttf",
      italics: "src/fonts/Roboto-Italic.ttf",
      bolditalics: "src/fonts/Roboto-MediumItalic.ttf",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: "Product Price Analysis Report", style: "header" },
      { text: "User Product Comparisons", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*"],
          body: [
            ["Product Name", "User Price", "Market Average Price"],
            ...reportData.userProductComparisons.map(comparison => {
              const formattedUserPrice =
                typeof comparison.userPrice === "number"
                  ? `$${comparison.userPrice.toFixed(2)}`
                  : "N/A";
              const formattedMarketPrice =
                typeof comparison.averageMarketPrice === "number"
                  ? `$${comparison.averageMarketPrice.toFixed(2)}`
                  : "N/A";

              return [
                comparison.productName,
                formattedUserPrice,
                formattedMarketPrice,
              ];
            }),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
    },
  };

  const reportsDir = path.join(__dirname, "src", "reports");
  const reportPath = path.join(reportsDir, "report.pdf");

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(reportPath));
  pdfDoc.end();

  console.log(reportData);
  console.log("Report generated successfully.");
};

const createPDF = async userId => {
  const dataForReport = await fetchDataForReport(userId);
  await generatePDFReport(dataForReport);
  console.log("Report generated successfully.");
};

module.exports = {
  createPDF,
};
