const axios = require("axios");
const Product = require("../models/Product");

const setNutritionalValues = async (barcode, quantity, price) => {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    const response = await axios.get(url);

    if (response.data.status === 1) {
        const product = response.data.product;

        const filteredProduct = {
            name: product.product_name,
            barcode,
            price,
            brand: product.brands,
            picture: product.image_url,
            category: product.categories ? product.categories : null,
            nutritionalInformation: product.nutriments,
            availableQuantity: quantity
        };

        return filteredProduct;
    } else {
        return { error: "produit introuvable" };
    }
};

const getAllProductsOFF = async (page = 1, pageSize = 20, searchTerm = '', category = '') => {
    try {
        const baseUrl = 'https://world.openfoodfacts.org/cgi/search.pl';

        const config = {
            timeout: 60000,
            params: {
                action: 'process',
                json: true,
                page: page,
                page_size: pageSize,
                search_terms: searchTerm,
                fields: 'code,product_name,brands,image_url,categories_tags',
            }
        };

        if (category) {
            config.params.tagtype_0 = 'categories';
            config.params.tag_contains_0 = 'contains';
            config.params.tag_0 = category;
        }

        let retries = 3;
        while (retries > 0) {
            try {
                const response = await axios.get(baseUrl, config);

                return {
                    products: response.data.products || [],
                    count: response.data.count || 0,
                    page: response.data.page || 1,
                    pageSize: response.data.page_size || pageSize,
                    totalPages: Math.ceil((response.data.count || 0) / pageSize)
                };
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (error) {
        console.error('OpenFoodFacts API Error:', error.message);
        console.log(error, "eeerror")
        throw new Error(`Failed to fetch products from OpenFoodFacts: ${error.message}`);
    }
};


module.exports = { setNutritionalValues, getAllProductsOFF };
