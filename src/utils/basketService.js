const extractPriceDifferences = (currentBasket, previousBasket) => {
  const productPriceDifferences = [];

  if (currentBasket.products.length == previousBasket.products.length) {
    for (let i = 0; i < currentBasket.products.length; i++) {
      const currentProduct = currentBasket.products[i];
      const previousProduct = previousBasket.products[i];
      if (
        currentProduct.productPrice != previousProduct.productPrice &&
        currentProduct.name == previousProduct.name
      )
        productPriceDifferences.push({
          productName: currentProduct.productName,
          currentPrice: currentProduct.productPrice,
          previousPrice: previousProduct.productPrice,
          difference: +(
            currentProduct.productPrice - previousProduct.productPrice
          ).toFixed(2),
          imageUrl: currentProduct.imageUrl,
        });
    }
  }

  return productPriceDifferences;
};

module.exports = {
  extractPriceDifferences,
};
