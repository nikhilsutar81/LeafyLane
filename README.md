<div align="center">
  <h1><img src="https://leafylane-client.vercel.app/favicon.png" width="20" height="20" alt=":LeafyLane Favicon">LeafyLane</h1>
  <p>
    A modern <b>Full-Stack Grocery Delivery Platform</b> built with the <b>MERN Stack</b>, featuring user authentication, product browsing and an admin panel for product/order management.
  </p>
</div>

---

# 📑 Table of Contents
- [Description](#-description)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [File Structure](#-file-structure)
- [Disclaimer](#-disclaimer)

---

# 📝 Description
LeafyLane is a **grocery delivery web application** designed to replicate the real-world workflow of e-commerce platforms.  
It allows users to **browse products, filter categories, add to cart, and checkout** via Cash on Delivery.  

This project demonstrates end-to-end knowledge of:
- **Frontend (React + Tailwind)** for building fast, responsive UIs.  
- **Backend (Node.js + Express + MongoDB)** for API development and data persistence.  
- **Authentication (Passport.js + OAuth)** to secure access.  
- **Media Uploads (Cloudinary)** for scalable asset management.  

> 🚀 This project showcases my **MERN Stack proficiency** and ability to design scalable full-stack applications.


---

# ✨ Features

- 🔑 User authentication (Email/Password & Google OAuth)  
- 👤 Profile management & updates  
- 🛒 Product browsing with category filters & search  
- 🛍️ Add/remove items from the shopping cart  
- 💳 Multiple payment methods: **Stripe** (secure online payments) & **Cash on Delivery**  
- 📦 Admin dashboard for orders & product management (future scope / WIP)  
- 🖼️ Image & media upload with **Cloudinary**  
- 🌐 Fully responsive UI for mobile & desktop  

---

# Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router DOM
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: Passport.js (with Google OAuth)
- **Media Hosting**: Cloudinary
- **Deployment**: Vercel (frontend)

---

# Screenshots

# LeafyLane client side
<img width="1879" height="889" alt="Screenshot 2025-09-21 130551" src="https://github.com/user-attachments/assets/6458c295-5bfc-484e-9fae-b27da95aedba" />

# LeafyLane Seller Panel:
<img width="1875" height="912" alt="Screenshot 2025-09-21 132356" src="https://github.com/user-attachments/assets/a2523a17-4aaa-463e-8529-a13f82d0c1eb" />

---

# 🚀 Getting Started

Follow these steps to run the project locally:

### 1️⃣ Clone the repository
```
git clone https://github.com/<your-username>/leafylane.git
cd leafylane
```

### 2️⃣ Install dependencies
```
Install server dependencies:
cd server
npm install
```
```
Install client dependencies:
cd ../client
npm install
```

### 3️⃣ Configure environment variables
```
Create a .env file in both server and client directories (see Environment Variables
).
```

### 4️⃣ Run the development servers
```
Start backend:
cd server
npm run dev


Start frontend:
cd client
npm run dev
```

---

# 🔐 Environment Variables

**Server .env**
```
MONGODB_URI=
JWT_SECRET=
NODE_ENV=development
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
SELLER_EMAIL=
SELLER_PASSWORD=
```

**client .env**
```
VITE_CURRENCY = '$'
VITE_BACKEND_URL = 
```

---

# 📂 File Structure
```
leafylane/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page-level components
│ │ ├── context/ # React Context API
│ │ ├── hooks/ # Custom hooks
│ │ ├── assets/ # Images, icons
│ │ └── App.jsx # Root component
│ └── package.json
│
├── server/ # Express backend
│ ├── config/ # DB & Cloudinary setup
│ ├── controllers/ # Request handlers
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & error handling
│ ├── utils/ # Helpers, validators
│ └── server.js # Entry point
│
├── .gitignore
└── README.md
```
---

## Disclaimer

This project is for learning and portfolio purposes only.
All assets (images, videos, logos) belong to their respective owners.
No copyright infringement is intended.
