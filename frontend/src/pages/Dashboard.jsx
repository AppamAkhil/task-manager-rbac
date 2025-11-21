import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import TaskCard from '../components/TaskCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tasks', {
        params: { q: q || undefined, status: status || undefined, limit: 50, offset: 0 }
      });
      setTasks(res.data);
    } catch (e) {
      alert('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleted = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input placeholder="Search title/description" value={q} onChange={e => setQ(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>
        <button onClick={fetchTasks} disabled={loading}>{loading ? 'Loading...' : 'Filter'}</button>
        <Link to="/tasks/create" style={{ marginLeft: 'auto' }}>Create Task</Link>
      </div>

      {user?.role === 'admin' ? (
        <p style={{ color: '#555' }}>Admin view: all tasks in the system.</p>
      ) : (
        <p style={{ color: '#555' }}>Your tasks only.</p>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDeleted={handleDeleted} />
        ))}
        {!tasks.length && !loading && <p>No tasks found.</p>}
      </div>
    </div>
  );
}