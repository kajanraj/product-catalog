# 🛍️ Product Catalog REST API
**Assignment 1 – CRUD with Mongoose + Express + MongoDB**

---

## 📁 Project Structure

```
product-catalog-api/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── productController.js  # All CRUD logic
│   ├── middleware/
│   │   └── errorMiddleware.js    # 404 + global error handler
│   ├── models/
│   │   └── Product.js            # Mongoose schema & model
│   ├── routes/
│   │   └── productRoutes.js      # Express route definitions
│   └── server.js                 # App entry point
├── .env                          # Environment variables (not committed)
├── .env.example                  # Template for env vars
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd product-catalog-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/product_catalog
```

### 4. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## 📦 Product Schema

| Field         | Type      | Required | Notes                        |
|---------------|-----------|----------|------------------------------|
| `name`        | String    | ✅       | Max 100 chars                |
| `sku`         | String    | ✅       | Unique, auto-uppercased      |
| `price`       | Number    | ✅       | Min 0                        |
| `inStock`     | Boolean   | ❌       | Default: `true`              |
| `quantity`    | Number    | ✅       | Min 0, Default: 0            |
| `category`    | String    | ✅       |                              |
| `tags`        | [String]  | ❌       | Default: `[]`                |
| `releaseDate` | Date      | ❌       | Default: now                 |
| `description` | String    | ❌       | Max 1000 chars               |
| `rating`      | Number    | ❌       | 0–5, Default: 0              |

---

## 🔗 API Endpoints

### Base URL: `http://localhost:5000/api/products`

---

### ➕ Create a Product
**POST** `/api/products`

**Request Body (JSON):**
```json
{
  "name": "Wireless Headphones",
  "sku": "WH-001",
  "price": 49.99,
  "inStock": true,
  "quantity": 100,
  "category": "Electronics",
  "tags": ["audio", "wireless", "bluetooth"],
  "releaseDate": "2024-01-15",
  "description": "High quality wireless headphones with noise cancellation",
  "rating": 4.5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ...product }
}
```

---

### 📋 Get All Products
**GET** `/api/products`

**Query Parameters (all optional):**

| Param      | Example             | Description                  |
|------------|---------------------|------------------------------|
| `page`     | `?page=1`           | Page number (default: 1)     |
| `limit`    | `?limit=10`         | Items per page (default: 10) |
| `category` | `?category=Electronics` | Filter by category       |
| `inStock`  | `?inStock=true`     | Filter by stock status       |
| `minPrice` | `?minPrice=10`      | Minimum price filter         |
| `maxPrice` | `?maxPrice=100`     | Maximum price filter         |
| `search`   | `?search=headphone` | Search name & description    |
| `sort`     | `?sort=-price`      | Sort field (- for desc)      |

**Response (200):**
```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "count": 10,
  "data": [ ...products ]
}
```

---

### 🔍 Get Product by ID
**GET** `/api/products/:id`

**Response (200):**
```json
{
  "success": true,
  "data": { ...product }
}
```

---

### ✏️ Update a Product
**PUT** `/api/products/:id`

**Request Body:** Same structure as create (include fields to update)

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ...updatedProduct }
}
```

---

### 🗑️ Delete a Product
**DELETE** `/api/products/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": { ...deletedProduct }
}
```

---

## ❌ Error Responses

| Status | Scenario                          |
|--------|-----------------------------------|
| 400    | Validation error / duplicate SKU  |
| 404    | Product not found / route missing |
| 500    | Internal server error             |

---

## 🧪 Test with cURL

```bash
# Create
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","sku":"TP-001","price":29.99,"quantity":50,"category":"Test"}'

# List all
curl http://localhost:5000/api/products

# Get by ID
curl http://localhost:5000/api/products/<id>

# Update
curl -X PUT http://localhost:5000/api/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"price":39.99}'

# Delete
curl -X DELETE http://localhost:5000/api/products/<id>
```
