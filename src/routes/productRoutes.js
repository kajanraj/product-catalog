const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// POST   /api/products       → Create a product
// GET    /api/products       → List all products (supports ?page=&limit=&category=&inStock=&minPrice=&maxPrice=&search=&sort=)
router.route("/").post(createProduct).get(getAllProducts);

// GET    /api/products/:id   → Get one product
// PUT    /api/products/:id   → Update a product
// DELETE /api/products/:id   → Delete a product
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
