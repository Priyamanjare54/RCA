# 🏏 Rajendra Cricket Academy (RCA) Pro

Welcome to the **Rajendra Cricket Academy (RCA) Pro** codebase. This repository is structured as a monorepo containing both the backend service and frontend application for managing the academy.

---

## 📁 Repository Structure

```text
rca/
├── backend/            # Express.js REST API with MongoDB/Mongoose
├── frontend/           # React + TypeScript + Vite Single Page Application
├── .gitignore          # Global git ignore rules (node_modules, .env, builds)
└── README.md           # Project documentation (this file)
```

---

## 🔑 Default Administrator Credentials

When the backend starts up, it automatically seeds a default Admin user into the database if one does not already exist:

* **Username:** `Aryan`
* **Password:** `Aryan`
* **Role:** `Admin`

---

## ⚙️ Setup & Installation

Follow these instructions to run the entire stack locally.

### 1. Backend Service Setup

**Prerequisites:** Node.js, MongoDB (Local or Atlas Instance)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000` by default.*

---

### 2. Frontend Application Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Set your `GEMINI_API_KEY` in `frontend/.env.local` for the chatbot and AI components:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

Access levels within the application depend on the user's role:

| Role | Dashboard | Students | Attendance | Performance | Schedule | AI Coach / Chat | Staff |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Admin** | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Full Access |
| **Coach** | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ❌ Restrict |
| **Student**| ⚠️ Read Only  | ⚠️ Read Only  | ⚠️ Read Only  | ⚠️ Read Only  | ⚠️ Read Only  | ✅ Read/Write | ❌ Restrict |
