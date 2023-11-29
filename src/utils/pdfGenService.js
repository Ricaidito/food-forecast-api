const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Price = require("../models/price.model");
const UserProduct = require("../models/userProduct.model");
const UserReport = require("../models/userReports.model");
const Basket = require("../models/basket.model");

const fetchDataForReport = async userId => {
  const [userProducts, similarProducts] = await fetchSimilarProducts(userId);
  const marketOverview = await fetchQuickMarketOverview();
  const reportData = {
    userProducts,
    similarProducts,
    marketOverview,
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

const imageToDataURL = pathOfFile => {
  const filePath = path.join(__dirname, pathOfFile);
  const imageBuffer = fs.readFileSync(filePath);
  const imageType = filePath.split(".").pop();
  const base64Image = imageBuffer.toString("base64");
  return `data:image/${imageType};base64,${base64Image}`;
};

const extractSimilarProductData = similarProduct => {
  const { similar } = similarProduct;
  const data = [];

  for (const product of similar) {
    const { productName, price } = product;
    data.push(`${productName} - $${price}`);
  }

  return data;
};

const generatePDFReport = (reportData, reportDate = null) => {
  const fonts = {
    Roboto: {
      normal: "src/assets/fonts/Roboto-Regular.ttf",
      bold: "src/assets/fonts/Roboto-Medium.ttf",
      italics: "src/assets/fonts/Roboto-Italic.ttf",
      bolditalics: "src/assets/fonts/Roboto-MediumItalic.ttf",
    },
  };

  const userProductsTableBody = reportData.userProducts.map(userProduct => [
    userProduct.productName,
    `$${userProduct.price}`,
    userProduct.category,
  ]);

  const similarProductsContent = reportData.similarProducts.map(
    similarProduct => [
      {
        text: similarProduct.productName,
        style: "subheader",
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
      },
      {
        ul: extractSimilarProductData(similarProduct),
      },
    ]
  );

  const marketOverviewContent = reportData.marketOverview.map(product => [
    product.productName,
    `$${product.productPrice}`,
  ]);

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    header: {
      columns: [
        {
          text: "Food Forecast ©",
          alignment: "left",
          fontSize: 10,
          margin: 10,
        },
        {
          text: reportData
            ? reportDate.toLocaleDateString()
            : new Date().toLocaleDateString(),
          alignment: "right",
          fontSize: 10,
          margin: 10,
        },
      ],
      columnGap: 10,
    },
    content: [
      {
        columns: [
          {
            text: "Reporte de precios y productos",
            style: "header",
            fontSize: 18,
            margin: 10,
            bold: true,
            alignment: "left",
          },
          {
            image: imageToDataURL("../assets/food-forecast-logo.png"),
            width: 100,
            height: 34.75,
            alignment: "right",
            margin: [0, 10, 0, 10],
          },
        ],
      },
      {
        text: "Productos del usuario:",
        style: "header",
        fontSize: 16,
        bold: true,
        margin: 20,
      },
      {
        table: {
          widths: ["*", "*", "*"],
          headerRows: 1,
          body: [["Nombre", "Precio", "Categoría"], ...userProductsTableBody],
        },
        layout: "lightHorizontalLines",
      },
      {
        text: "Productos y precios similares:",
        style: "header",
        fontSize: 16,
        margin: [20, 15, 20, 5],
        bold: true,
      },
      ...similarProductsContent,
      {
        text: "Resumen del mercado:",
        style: "header",
        fontSize: 16,
        margin: [20, 10, 20, 5],
        bold: true,
      },
      {
        table: {
          widths: ["*", "*"],
          headerRows: 1,
          body: [["Nombre", "Precio"], ...marketOverviewContent],
        },
        layout: "lightHorizontalLines",
      },
    ],
    footer: function (currentPage, pageCount) {
      return {
        text: currentPage.toString() + " de " + pageCount,
        alignment: "center",
        margin: [0, 0, 0, 30],
      };
    },
  };

  return printer.createPdfKitDocument(docDefinition);
};

const generateReportName = () => {
  const currentDate = new Date();
  const reportDate = currentDate.toLocaleDateString().split("/");
  const [day, month, year] = reportDate;
  const formattedDate = `${year}_${month}_${day}`;
  return `reporte_${formattedDate}.pdf`;
};

const createPDF = async userId => {
  const dataForReport = await fetchDataForReport(userId);
  const fileName = generateReportName();
  await new UserReport({
    userId: new mongoose.Types.ObjectId(userId),
    fileName,
    ...dataForReport,
  }).save();
  return [generatePDFReport(dataForReport), fileName];
};

const createPDFFromData = async pdfId => {
  const reportData = await UserReport.findById(pdfId);
  const data = {
    userProducts: reportData.userProducts,
    similarProducts: reportData.similarProducts,
    marketOverview: reportData.marketOverview,
  };
  return [generatePDFReport(data, reportData.createdAt), reportData.fileName];
};

module.exports = {
  createPDF,
  createPDFFromData,
};
