require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ── Connect to MongoDB ──────────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🛍️  Product Catalog API is running",
    version: "1.0.0",
    endpoints: {
      "POST   /api/products":     "Create a product",
      "GET    /api/products":     "List all products",
      "GET    /api/products/:id": "Get one product",
      "PUT    /api/products/:id": "Update a product",
      "DELETE /api/products/:id": "Delete a product",
    },
  });
});

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/products", productRoutes);

// ── Error Handlers ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
