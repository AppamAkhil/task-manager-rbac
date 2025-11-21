import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateEditTask from './pages/CreateEditTask.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/tasks/create" element={
          <ProtectedRoute>
            <CreateEditTask />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:id/edit" element={
          <ProtectedRoute>
            <CreateEditTask />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}