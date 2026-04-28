# 🍕 Bella Cucina — Full Stack Restaurant Website

A complete, professional food delivery website built with 
React + Node.js + Express + MongoDB.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, Bcrypt
- **Security:** Helmet, Rate Limiting

---

## 📁 Project Structure

├── backend/   ← Node.js + Express API
└── frontend/  ← React App

---

## ✅ Features

- Beautiful responsive UI (mobile + desktop)
- User registration & login (JWT auth)
- Strong password validation
- Browse menu by category with real photos
- Add to cart (saved in localStorage)
- Guest checkout (no account needed)
- Live order tracking
- Admin dashboard with stats
- Admin order & menu management

---

## 🔌 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Menu
- GET /api/menu
- POST /api/menu (admin)
- PUT /api/menu/:id (admin)
- DELETE /api/menu/:id (admin)

### Orders
- POST /api/orders
- GET /api/orders/myorders

### Admin
- GET /api/admin/stats
- GET /api/admin/orders
- PUT /api/admin/orders/:id/status

---

## ⚙️ Local Setup

### Backend
cd backend
npm install
cp .env.example .env
npm run dev

### Frontend
cd frontend
npm install
npm start

---

Made with ❤️ by Zohaib Khan
