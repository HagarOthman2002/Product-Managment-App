const Product = require("../models/product.model");


exports.addProduct = async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const user = req.user;

  if (!name) {
    return res.status(400).json({
      error: true,
      message: "Product Name is required",
    });
  }
  if (!price) {
    return res.status(400).json({
      error: true,
      message: "Product price is required",
    });
  }
  if (inStock === undefined) {
    return res.status(400).json({
      error: true,
      message: "Product status is required",
    });
  }
  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      inStock,
      img: req.file ? req.file.filename : null,
      userId: user.id,
    });
    await product.save();
    return res.json({
      error: false,
      product,
      message: "product added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

exports.editeProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, category, inStock } = req.body;
  const user = req.user;

  // At least one field must be provided
  if (name === undefined && description === undefined && price === undefined && category === undefined && inStock === undefined) {
    return res.status(400).json({ error: true, message: "No changes provided" });
  }

  try {
    const product = await Product.findOne({ _id: productId, userId: user._id });
    if (!product) {
      return res.status(404).json({ error: true, message: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (inStock !== undefined) product.inStock = inStock;
    if (req.file) product.img = req.file.filename;

    await product.save();
    return res.json({ error: false, product, message: "Product updated successfully" });
  } catch (error) {
    console.error("Edit Product Error:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.getAllProducts = async (req, res) => {
  const user = req.user;
  try {
    const products = await Product.find({ userId: user._id }).sort({
      price: -1,
    });
    return res.json({
      error: false,
      products,
      message: "All products retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const user = req.user;
  try {
    const product = await Product.findOne({
      _id: productId,
      userId: user._id,
    });
    if (!product) {
      return res.status(400).json({
        error: true,
        message: "Product not found",
      });
    }
    await Product.deleteOne({ _id: productId, userId: user._id });
    return res.json({
      error: false,
      message: "Product deleted successfuly",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};