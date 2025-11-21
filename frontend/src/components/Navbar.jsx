import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: '1px solid #ddd', marginBottom: 16
    }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 700 }}>Task Manager</Link>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {token ? (
          <>
            <span style={{ color: '#555' }}>
              Signed in as <strong>{user?.username}</strong> ({user?.role})
            </span>
            <Link to="/tasks/create">Create Task</Link>
            <button onClick={handleLogout} style={{ padding: '6px 10px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}