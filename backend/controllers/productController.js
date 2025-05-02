const Product = require("../models/Product");
const { setNutritionalValues, getAllProductsOFF } = require("../utils/openFoodFact");


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { barcode } = req.params;
    const { quantity, price } = req.body;
    const product = await setNutritionalValues(barcode, quantity, price);

    if (product.error) {
      return res.status(201).json(product);
    }

    const newProduct = new Product(product);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Database error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProductsOFF = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, search = '', category = '' } = req.params;

    const data = await getAllProductsOFF(
      parseInt(page),
      parseInt(pageSize),
      search,
      category
    );

    res.json(data);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
