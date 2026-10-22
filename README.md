# DriveEasy - Self-Drive Car Rental Booking Platform

**Course / Exam:** ITUE301 - Advanced Web Development Frameworks  
**Project Name:** DriveEasy Car Rental System  
**Architecture:** MERN Stack (React + Express + Node.js + MongoDB Mongoose)

---

## 🚀 Tech Stack

- **Frontend:** React 18 (Vite), React Router DOM v6, Axios, Custom Vanilla CSS Design System with Glassmorphism, Google Fonts (Inter).
- **Backend:** Node.js, Express.js (CommonJS), Mongoose ODM, JSON Web Tokens (`jsonwebtoken`), `dotenv`, `cors`.
- **Database:** MongoDB (Local or MongoDB Atlas).

---

## 📂 Project Structure

```text
itue301-exam-24it045-A/
├── backend/
│   ├── config/
│   │   └── db.js                       # Mongoose connection logic
│   ├── controllers/
│   │   ├── authController.js           # Login & JWT generation
│   │   ├── bookingController.js        # Reservation workflow & status updates
│   │   └── vehicleController.js        # Fleet retrieval
│   ├── middleware/
│   │   ├── authGuard.js                # Custom JWT Bearer token validator
│   │   ├── errorHandler.js             # Global Mongoose error normalizer & 404 catcher
│   │   └── requestLogger.js            # Global request logger [METHOD] [PATH] [TIME]
│   ├── models/
│   │   ├── Booking.js                  # Booking schema with date validation
│   │   ├── Customer.js                 # Customer schema with license unique constraint
│   │   └── Vehicle.js                  # Vehicle schema with type enum & min pricing
│   ├── routes/
│   │   ├── auth.js                     # /api/v1/auth
│   │   ├── bookings.js                 # /api/v1/bookings
│   │   └── vehicles.js                 # /api/v1/vehicles
│   ├── .env.example                    # Backend environment template
│   ├── package.json                    # Backend scripts & dependencies
│   ├── seed.js                         # Database seeder (2 customers, 10 vehicles)
│   └── server.js                       # Express server pipeline & entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Sticky glassmorphic navigation
│   │   │   ├── ProtectedRoute.jsx      # Auth route guard (<Navigate to="/" />)
│   │   │   └── VehicleCard.jsx         # Card with ternary Book Now / Unavailable badge
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Auth state provider + useAuth hook
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx          # Lazy-loaded fleet manager analytics (React.lazy)
│   │   │   ├── FleetPage.jsx           # Fleet grid, client filtering, slide-in booking
│   │   │   ├── LoginPage.jsx           # Centered glass card + 1-click demo fill
│   │   │   └── MyBookingsPage.jsx      # Customer reservations with status & cancel
│   │   ├── App.jsx                     # Router config & lazy suspense
│   │   ├── index.css                   # Global design tokens, dark navy glassmorphism
│   │   └── main.jsx                    # React 18 DOM mount
│   ├── .env.example                    # Frontend environment template
│   ├── index.html                      # HTML entry with Inter Google Font
│   ├── package.json                    # Frontend dependencies
│   └── vite.config.js                  # Vite configuration
├── .gitignore
└── README.md
```

---

## 🔑 Demo Login Credentials (No Password Required)

In DriveEasy, a customer's **driving license number** acts as their authentication credential:

| Customer Name | Email | Driving License Number |
| :--- | :--- | :--- |
| **Rahul Sharma** | `rahul@example.com` | `DL-0420110012345` |
| **Priya Patel** | `priya@example.com` | `MH-0220190098765` |

> 💡 **Viva Tip:** The Login Page includes **1-click quick-fill buttons** to immediately populate these credentials during your demonstration!

---

## 🌐 MongoDB Atlas Setup (Cloud Database)

If you are using MongoDB Atlas rather than a local instance:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free Shared Cluster.
2. Under **Database Access**, create a database user (e.g., `examuser` with password `ExamPassword123!`).
3. Under **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`).
4. Click **Connect** on your cluster -> **Drivers** -> Copy the connection string.
5. In `backend/.env`, set:
   ```env
   MONGO_URI=mongodb+srv://examuser:ExamPassword123!@cluster0.mongodb.net/driveeasy?retryWrites=true&w=majority
   ```

---

## ⚙️ Backend Setup & Run Steps

Open a terminal and navigate to `/backend`:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install backend dependencies
npm install

# 3. Configure environment variables (if not already created)
cp .env.example .env

# 4. Seed the database (Clears collections, inserts 2 customers & 10 vehicles)
npm run seed

# 5. Start the backend API server
npm start
```
The backend server runs on `http://localhost:5000`.

---

## 💻 Frontend Setup & Run Steps

Open a second terminal and navigate to `/frontend`:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Configure environment variables (if not already created)
cp .env.example .env

# 4. Start Vite development server
npm run dev
```
The React frontend runs on `http://localhost:5173`.

---

## 📡 REST API Endpoint Documentation

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Access | Description | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates customer & returns JWT | `{ "email": "rahul@example.com", "licenseNumber": "DL-0420110012345" }` |
| `GET` | `/vehicles` | Public | Returns all vehicles in fleet | None |
| `POST` | `/bookings` | Protected (JWT) | Reserves an available vehicle | `{ "vehicleId": "<ID>", "pickupDate": "2026-10-25", "returnDate": "2026-10-28" }` |
| `GET` | `/bookings/my` | Protected (JWT) | Returns current customer's bookings | Populates `customerId` and `vehicleId` |
| `PATCH` | `/bookings/:id/status` | Protected (JWT) | Modifies status (cancelled / completed) | `{ "status": "cancelled" }` |

---

## 🧪 Postman & Thunder Client Test Suite

### 1. Customer Login (200 OK)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/login`
- **Body (raw JSON):**
  ```json
  {
    "email": "rahul@example.com",
    "licenseNumber": "DL-0420110012345"
  }
  ```
- **Expected:** `200 OK` with `{ "success": true, "token": "...", "customer": { ... } }`.
- *Action:* Copy the `token` value for protected requests below.

### 2. Get All Vehicles (200 OK - Public)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/vehicles`
- **Expected:** `200 OK` with 10 vehicles. Notice that `Tata Altroz XZ` and `Skoda Slavia Style` have `available: false`.

### 3. Create Booking (201 Created - Protected)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/bookings`
- **Headers:** `Authorization: Bearer <YOUR_COPIED_TOKEN>`
- **Body (raw JSON):**
  ```json
  {
    "vehicleId": "<COPIED_AVAILABLE_VEHICLE_ID>",
    "pickupDate": "2026-11-01T00:00:00.000Z",
    "returnDate": "2026-11-05T00:00:00.000Z"
  }
  ```
- **Expected:** `201 Created` with reservation details. Backend immediately sets `vehicle.available = false`.

### 4. Book the Same Vehicle Again (400 Bad Request - Availability Check)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/bookings`
- **Headers:** `Authorization: Bearer <YOUR_COPIED_TOKEN>`
- **Body (raw JSON):** Same body as Test 3.
- **Expected:** `400 Bad Request` with `{ "success": false, "message": "Vehicle is not available" }`.

### 5. Get My Bookings (200 OK - Protected)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/bookings/my`
- **Headers:** `Authorization: Bearer <YOUR_COPIED_TOKEN>`
- **Expected:** `200 OK` returning an array of bookings populated with vehicle model and type.

### 6. Cancel Booking / Update Status (200 OK - Protected)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/v1/bookings/<BOOKING_ID>/status`
- **Headers:** `Authorization: Bearer <YOUR_COPIED_TOKEN>`
- **Body (raw JSON):**
  ```json
  {
    "status": "cancelled"
  }
  ```
- **Expected:** `200 OK`. The vehicle's `available` field in MongoDB is automatically restored to `true`.

### 7. Request Without Token (401 Unauthorized)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/bookings/my`
- **Headers:** None (omit Authorization header).
- **Expected:** `401 Unauthorized` with `{ "success": false, "message": "Access denied. No authentication token provided in Authorization header." }`.
