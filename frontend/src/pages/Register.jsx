import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api.js';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/register', { username, password, role });
      alert('Registered! Please login.');
      navigate('/login');
    } catch (e) {
      alert('Registration failed (username may already exist)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <button disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <p style={{ marginTop: 8 }}>
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}