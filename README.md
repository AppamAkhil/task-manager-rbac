# Task Manager with Role-Based Access (SQLite + Express + React)

A full-stack RBAC task manager:
- Users register/login
- Normal users can CRUD only their own tasks
- Admins can view all tasks and delete any task
- JWT auth, bcrypt hashing
- Simple React UI with protected routes

## Tech
- Backend: Node.js (>=18), Express, SQLite, JWT, bcrypt, Joi, CORS
- Frontend: React (Vite), React Router, Axios

## Setup

### Backend
```bash
cd backend
npm install
# set .env
# JWT_SECRET=your_very_long_random_secret_key_here
# PORT=5000
npm run dev