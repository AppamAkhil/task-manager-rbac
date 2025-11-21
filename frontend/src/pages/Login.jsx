import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/login', { username, password });
      login(res.data);
      navigate('/');
    } catch (e) {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p style={{ marginTop: 8 }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}