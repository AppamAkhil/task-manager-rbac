import React from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function TaskCard({ task, onDeleted }) {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.id === task.createdBy;
  const canDelete = user?.role === 'admin' || user?.id === task.createdBy;

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${task.id}`);
      onDeleted?.(task.id);
    } catch (e) {
      alert('Failed to delete');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{task.title}</h3>
        <span style={{
          padding: '2px 8px', borderRadius: 12,
          backgroundColor: task.status === 'done' ? '#d1fadf' :
                          task.status === 'in-progress' ? '#fff3c4' : '#e7eaf6'
        }}>
          {task.status}
        </span>
      </div>
      <p style={{ color: '#555' }}>{task.description || 'No description'}</p>
      <small style={{ color: '#777' }}>Created at: {new Date(task.createdAt).toLocaleString()}</small>

      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        {canEdit && (
          <Link to={`/tasks/${task.id}/edit`} style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6 }}>
            Edit
          </Link>
        )}
        {canDelete && (
          <button onClick={handleDelete} style={{ padding: '6px 10px', border: '1px solid #f00', color: '#f00', borderRadius: 6 }}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}