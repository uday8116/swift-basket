# Swift Basket 🛒

A full-stack Multi-Vendor E-commerce platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features role-based access control (Supreme Admin vs. Retailers), automated inventory management, payment integration, and a premium responsive UI.

## 🚀 Features

### User & Role Management
*   **Multi-Vendor System**: 
    *   **Supreme Admin**: Global access to all products, orders, and users. Can promote/demote users.
    *   **Retailer**: Restricted access. Can only manage *their own* products and view orders for their products.
    *   **Customer**: Browse, search, cart, checkout, and order history.
*   **Authentication**: Secure JWT-based auth with HTTP-only cookies (if configured) or Bearer tokens.

### E-Commerce Core
*   **Product Management**: Create, Read, Update, Delete (CRUD) products with **multiple image uploads** and image gallery.
*   **Dynamic Filters**: Categories and brands in product listing are dynamically managed by admin.
*   **Shopping Cart**: Dynamic cart with stock checks and real-time total calculation.
*   **Checkout Flow**: Shipping Address -> Payment Method -> Order Review -> Place Order.
*   **Order Tracking**: Users can track order status (Processing, Shipped, Delivered).
*   **Inventory**: Stock automatically decrements upon successful order placement.

### Admin Dashboard
*   **Home Content Management**: Admin can manage homepage brands and categories with images and discounts.
*   **Dynamic Brand Selection**: Brands created in home content appear in product creation dropdown.
*   **Product Image Gallery**: Upload multiple images per product with preview.
*   **User Management**: Super Admin can manage all users and their roles.

### Technical Highlights
*   **Testing**: 
    *   **Backend**: Unit & Integration tests using **Jest** and **Supertest**.
    *   **Frontend**: End-to-End (E2E) tests using **Playwright**.
*   **Logging**: Production-ready structured logging with **Winston** and **Morgan**.
*   **Security**: Rate limiting, `Helmet` headers, Input validation (`express-validator`), and NoSQL injection protection (`hpp`).
*   **Performance**: Gzip compression and server-side caching.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), React Router v6, Tailwind/Custom CSS, Context API.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ODM).
*   **Testing**: Jest, Supertest, Playwright.
*   **Tools**: ESLint, Postman, Git.

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URI)

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/swift-basket.git
cd swift-basket
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/swift-basket
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```
Start the server:
```bash
npm run server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Running Tests

### Backend Tests (Unit & Integration)
```bash
cd backend
npm test
```

### Frontend Tests (E2E)
```bash
cd frontend
npx playwright test
```

## 📂 Project Structure

```
swift-basket/
├── backend/            # Express Server, Models, Controllers, Routes
│   ├── __tests__/      # Integration Tests
│   ├── controllers/    # Route Logic & Unit Tests
│   ├── models/         # Mongoose Schemas
│   └── utils/          # Logger, Seeder
├── frontend/           # React Application (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # Global State (Auth, Cart)
│   │   ├── pages/      # Full Page Views
│   │   └── main.jsx    # Entry Point
│   ├── tests/          # Playwright E2E Tests
│   └── playwright.config.js
└── README.md           # Documentation
```

## 🛡️ Security & Best Practices
This project uses **Helmet** for secure headers, **express-rate-limit** to prevent abuse, and **hpp** to protect against HTTP Parameter Pollution. All inputs are validated before processing.

## 📄 License
MIT
