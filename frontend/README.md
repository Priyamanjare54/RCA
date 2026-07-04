<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🏏 Rajendra Cricket Academy Pro

Welcome to the **Rajendra Cricket Academy (RCA) Pro** management suite. This platform provides elite role-based access control (RBAC), player performance tracking, attendance management, scheduling, and AI-powered performance analysis.

---

## 🔑 Default Administrator Credentials

For ease of testing and initial login, the database automatically seeds a default Admin user:

* **Username:** `Aryan`
* **Password:** `Aryan`
* **Role:** `Admin`

> [!NOTE]
> **Important Login Info:** If you were previously logged in as a different user (e.g., `Aditya`), click the **"Deauthorize"** button at the bottom of the sidebar to clear your old browser session/local storage and log in with the new credentials.

---

## 🚀 Getting Started

To run the application locally, you will need to start both the **Backend** and the **Frontend** servers.

### 1. Backend Server Setup

**Prerequisites:** Node.js, MongoDB (Atlas or Local)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *On startup, the backend automatically connects to MongoDB and seeds the default Admin (`Aryan`) if it doesn't already exist.*

---

### 2. Frontend App Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your `GEMINI_API_KEY` in `frontend/.env.local` for the AI components:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. Start the frontend dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## 🛡️ Role-Based Access Control (RBAC)

The system supports three user roles with different levels of access:

| Role | Dashboard | Students | Attendance | Performance | Schedule | AI Coach / Chat | Staff |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Admin** | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Full Access |
| **Coach** | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ❌ Restrict |
| **Student**| ⚠️ Read Only  | ⚠️ Read Only  | ⚠️ Read Only  | ⚠️ Read Only  | ⚠️ Read Only  | ✅ Read/Write | ❌ Restrict |
