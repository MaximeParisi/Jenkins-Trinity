const Cart = require("../models/cart.model");
const mongoose = require("mongoose");
const Product = require("../models/Product");

exports.createCart = async (req, res) => {
  try {
    const cart = new Cart({
      userId: req.user.id
    });
    const newCart = await cart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({
      userId: req.user.id,
    });
    if (carts.length === 0) {
      return res.json('vide');
    }
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id);

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = req.body;

    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = await Product.findById(id);
    if (!cart) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedProducts = Array.isArray(cart.products) ? [...cart.products, product] : [product];

    cart.products = updatedProducts;
    await cart.save();

    res.status(200).json({ _id: cart._id, products: cart.products });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error)

  }
};

exports.removeToCart = async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;
  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productObjectId = new mongoose.Types.ObjectId(product_id);

    const updatedProducts = cart.products.filter(
      (product) => product.product && product.product._id.toString() !== product_id
    );

    cart.products = updatedProducts;
    await cart.save();
    console.log(cart.products, product_id)
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
