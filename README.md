# 🚐 RoadWay – Backend API

Node.js + Express + MySQL backend for the RoadWay transport booking system.

## 📁 Folder Structure
roadway-backend/
├── config/db.js              ← MySQL connection
├── controllers/
│   ├── authController.js     ← Signup & Login logic
│   └── bookingController.js  ← Booking CRUD logic
├── routes/
│   ├── authRoutes.js         ← Auth routes
│   └── bookingRoutes.js      ← Booking routes
├── server.js                 ← Entry point
├── database.sql              ← MySQL schema
└── .env                      ← Config

## ⚙️ Setup

1. Install packages:
   npm install

2. Setup MySQL:
   mysql -u root -p < database.sql

3. Edit .env → set your DB_PASSWORD

4. Run:
   node server.js
   (or: npx nodemon server.js)

## 🌐 API Endpoints

POST  /api/auth/signup          { name, email, password }
POST  /api/auth/login           { email, password }
POST  /api/booking/create       { pickup, drop_location, date, time, vehicle_type, passengers }
GET   /api/booking/all
GET   /api/booking/:id
PATCH /api/booking/:id/status   { status }

Server: http://localhost:5000
