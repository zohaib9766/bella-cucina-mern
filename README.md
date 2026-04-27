<<<<<<< HEAD
# 🍕 Bella Cucina — Full Stack Restaurant Website

A complete, professional food delivery website built with React + Node.js + MongoDB.

---

## 📁 Project Structure

```
bella-cucina/
├── backend/          ← Node.js + Express API
└── frontend/         ← React App
```

---

## ⚙️ SETUP INSTRUCTIONS (Step by Step)

### STEP 1 — Install Prerequisites
Make sure you have these installed:
- Node.js (v18+) → https://nodejs.org
- MongoDB Atlas account (free) → https://mongodb.com/atlas

---

### STEP 2 — Setup Backend

```bash
cd bella-cucina/backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and fill in:
```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.mongodb.net/bella-cucina
JWT_SECRET=any_random_secret_string_here
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_KEY   (get from stripe.com)
CLIENT_URL=http://localhost:3000
PORT=5000
```

Start the backend:
```bash
npm run dev
```

✅ You should see: "MongoDB Connected" and "Server running on port 5000"

---

### STEP 3 — Setup Frontend

```bash
cd bella-cucina/frontend
npm install
npm start
```

✅ Opens at http://localhost:3000

---

### STEP 4 — Seed the Database (Add Menu Items)

1. Register an account at http://localhost:3000/register
2. Go to MongoDB Atlas → Find your user → Change `role` from `"user"` to `"admin"`
3. Log in again at http://localhost:3000/login
4. Go to http://localhost:3000/admin/menu
5. Click **"🌱 Seed Demo Data"** button
6. 12 menu items will be added automatically!

---

## 🌐 ALL PAGES

| Page | URL |
|---|---|
| Home | http://localhost:3000 |
| Menu | http://localhost:3000/menu |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| My Orders | http://localhost:3000/orders |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| **Admin Dashboard** | http://localhost:3000/admin |
| **Admin Orders** | http://localhost:3000/admin/orders |
| **Admin Menu** | http://localhost:3000/admin/menu |

---

## 🔌 API ENDPOINTS

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login

### Menu
- `GET /api/menu` — Get all menu items
- `GET /api/menu/featured` — Get featured items
- `POST /api/menu` — Add item (admin)
- `PUT /api/menu/:id` — Update item (admin)
- `DELETE /api/menu/:id` — Delete item (admin)

### Orders
- `POST /api/orders` — Place order (auth required)
- `GET /api/orders/myorders` — Get my orders

### Admin
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/orders` — All orders
- `PUT /api/admin/orders/:id/status` — Update order status
- `POST /api/admin/seed` — Seed demo menu items

### Payment
- `POST /api/payment/create-payment-intent` — Create Stripe intent
- `POST /api/payment/confirm/:orderId` — Confirm payment

---

## 💳 Test Payment
Use Stripe test card: `4242 4242 4242 4242` | Expiry: any future | CVV: any 3 digits

---

## 🚀 DEPLOYMENT

### Frontend → Vercel (Free)
```bash
cd frontend
npm run build
# Push to GitHub → Connect to vercel.com → Deploy
```

### Backend → Railway (Free)
```bash
# Push backend folder to GitHub
# Go to railway.app → New Project → Deploy from GitHub
# Add environment variables in Railway dashboard
```

### Domain → Namecheap (~$10/year)
1. Buy domain at namecheap.com
2. In Vercel → Settings → Domains → Add your domain
3. Update Namecheap DNS to point to Vercel

---

## ✅ FEATURES

- ✅ Beautiful responsive UI (mobile + desktop)
- ✅ User registration & login (JWT auth)
- ✅ Browse menu by category
- ✅ Add to cart / update quantities
- ✅ Checkout with delivery address
- ✅ Stripe payment integration
- ✅ Order history for users
- ✅ Admin dashboard with stats
- ✅ Admin order management (update status)
- ✅ Admin menu management (add/edit/delete)
- ✅ One-click demo data seeding

---

Made with ❤️ by Claude for Bella Cucina 🍕
=======
# bella-cucina-mern
Full-stack restaurant web app built with React, Node.js, Express and MongoDB
>>>>>>> 5124205c6081725569e540342557ca6b421579b9
