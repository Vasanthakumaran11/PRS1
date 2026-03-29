# Product Review System (PRS) - Run Instructions

This project consists of a **FastAPI** backend and a **React (Vite)** frontend.

## Prerequisites
1. **Python 3.8+**
2. **Node.js & npm**
3. **MongoDB** (Running on `mongodb://localhost:27017`)

---

## 1. Backend Setup (FastAPI)

1. Open a terminal in the `backend/` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be available at `http://localhost:8000`.*
   *Interactive API Docs: `http://localhost:8000/docs`.*

---

## 2. Frontend Setup (React)

1. Open a new terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---

## 3. Features Implemented
- **JWT Authentication**: Register and Login with secure password hashing.
- **Product Engine**: Real-time product search, category filtering, and rating aggregation.
- **Review System**: Add reviews with quick-response keywords; automatic rating calculation.
- **Smart Cart**: Synchronized cart with quantity management.
- **Purchase Decision Engine**: (Core Feature) Compares Amazon vs. Flipkart based on your budget, location, and priority (Price, Speed, or Rating).

---

## Tips
- Ensure MongoDB is running before starting the backend.
- The backend will automatically seed 6 demo products if the database is empty on first run.
- Use the **Budget Optimizer** in the Cart page to see the Decision Engine in action!
