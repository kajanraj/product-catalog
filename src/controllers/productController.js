const Product = require("../models/Product");

// ─────────────────────────────────────────────
// @desc    Create a new product
// @route   POST /api/products
// @access  Public
// ─────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Duplicate SKU error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `SKU "${req.body.sku}" already exists. Please use a unique SKU.`,
      });
    }
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all products (with filter + pagination)
// @route   GET /api/products
// @access  Public
// ─────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      inStock,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = { $regex: category, $options: "i" };
    if (inStock !== undefined) filter.inStock = inStock === "true";
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${req.params.id}" not found`,
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID: "${req.params.id}"`,
      });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update a product (all fields)
// @route   PUT /api/products/:id
// @access  Public
// ─────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // return updated document
        runValidators: true, // run schema validators on update
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${req.params.id}" not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID: "${req.params.id}"`,
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `SKU "${req.body.sku}" already exists.`,
      });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
// ─────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${req.params.id}" not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID: "${req.params.id}"`,
      });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
