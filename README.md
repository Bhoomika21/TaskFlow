# TaskFlow — Full-Stack Task Management App

A production-ready Task Management Web Application with JWT authentication, built with React, Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 18, React Router v6, Axios          |
| Backend    | Node.js, Express 4                        |
| Database   | MongoDB + Mongoose                        |
| Auth       | JWT (jsonwebtoken) + bcryptjs             |
| Styling    | Custom CSS (dark theme, responsive)       |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── models/
│   │   ├── User.js                ← User schema (bcrypt pre-save hook)
│   │   └── Task.js                ← Task schema with userId reference
│   ├── routes/
│   │   ├── authRoutes.js          ← POST /auth/register, /auth/login
│   │   └── taskRoutes.js          ← All task CRUD routes (protected)
│   ├── controllers/
│   │   ├── authController.js      ← register + login logic
│   │   └── taskController.js      ← getAllTasks, createTask, updateTask, toggleComplete, deleteTask
│   ├── middleware/
│   │   └── authMiddleware.js      ← JWT verification gatekeeper
│   ├── server.js                  ← App entry point
│   ├── .env.example               ← Environment variable template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── LoginPage.jsx      ← Login form with validation
        │   ├── SignupPage.jsx     ← Register form with validation
        │   └── DashboardPage.jsx  ← Main task management view
        ├── components/
        │   ├── Navbar.jsx         ← Top navigation with logout
        │   ├── TaskForm.jsx       ← Add/Edit task form
        │   ├── TaskList.jsx       ← Task table wrapper
        │   ├── TaskItem.jsx       ← Single task row
        │   └── FilterBar.jsx      ← All/Pending/Completed filter
        ├── context/
        │   └── AuthContext.jsx    ← Global auth state + loginUser/logoutUser
        ├── services/
        │   └── api.js             ← Axios instance + all API functions
        ├── App.js                 ← Router + PrivateRoute/PublicRoute
        ├── App.css                ← Global dark theme styles
        └── index.js
```

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally or a MongoDB Atlas URI
- npm

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://bhoomika:bhoomika_06@taskflow.vxsc2ju.mongodb.net/?appName=taskflow
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev      # development (nodemon)
npm start        # production
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the frontend:
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## API Endpoints

### Auth (Public)

| Method | Endpoint         | Auth | Description               | Sample Body |
|--------|------------------|------|---------------------------|-------------|
| POST   | /auth/register   | No   | Register a new user       | `{"name":"Jane","email":"jane@example.com","password":"secret123"}` |
| POST   | /auth/login      | No   | Login, receive JWT token  | `{"email":"jane@example.com","password":"secret123"}` |

**Login response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Jane", "email": "jane@example.com" }
}
```

### Tasks (JWT Required — pass `Authorization: Bearer <token>`)

| Method | Endpoint       | Auth | Description                    | Sample Body |
|--------|----------------|------|--------------------------------|-------------|
| GET    | /tasks         | Yes  | Get all tasks for logged-in user | — |
| POST   | /tasks         | Yes  | Create a new task              | `{"title":"Buy groceries","priority":"High","dueDate":"2025-12-31"}` |
| PUT    | /tasks/:id     | Yes  | Update title, description, priority, dueDate | `{"title":"Updated title","priority":"Low"}` |
| PATCH  | /tasks/:id     | Yes  | Toggle completed status        | `{"completed": true}` |
| DELETE | /tasks/:id     | Yes  | Delete a task                  | — |

---

## Key Design Decisions

- **Password security**: bcrypt with salt rounds of 12; passwords never stored in plain text.
- **JWT**: Stored in `localStorage`; attached via Axios request interceptor on every API call.
- **User isolation**: All task queries filter by `userId` (set by `authMiddleware`); users cannot read/write/delete each other's tasks.
- **Optimistic UI**: Toggle and delete operations update local state immediately without a full re-fetch for speed.
- **Global 401 handling**: Axios response interceptor catches expired/invalid tokens and redirects to login automatically.
- **PrivateRoute / PublicRoute**: Unauthenticated users are redirected to `/login`; authenticated users are redirected away from auth pages.

---

## Assumptions

- MongoDB is running locally on port 27017 (or Atlas URI provided in `.env`).
- Frontend dev server runs on port 3000; backend on port 5000.
- The `proxy` field in `frontend/package.json` handles API calls in development (no CORS issues).
- JWT tokens expire after 7 days by default.
