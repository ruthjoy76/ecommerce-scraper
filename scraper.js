const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const targetURL = 'https://ecommerce.datablitz.com.ph/collections/pc-mac';


async function scrapeProductInformation(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const products = [];

    $('.product').each((index, element) => {
      const name = $(element).find('.product-title').text().trim();
      const price = $(element).find('.product-price').text().trim();
      const description = $(element).find('.product-description').text().trim();
      const ratings = $(element).find('.product-ratings').text().trim();
      const imageURL = $(element).find('.product-image').attr('src');

 

      const product = {
        name,
        price,
        description,
        ratings,
        imageURL,
      };

      products.push(product);
    });

    return products;
  } catch (error) {
    console.error('Error scraping data:', error.message);
    throw error;
  }
}


function saveToJSON(data) {
  const jsonContent = JSON.stringify(data, null, 2);
  fs.writeFileSync('scraped-data.json', jsonContent);
}


async function main() {
  try {
    const products = await scrapeProductInformation(targetURL);
    saveToJSON(products);
    console.log('Scraping complete. Data saved to scraped-data.json');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
