import React, { useState, useEffect } from 'react';

export default function TaskForm({ initial = null, onSubmit, submitting }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState(initial?.status || 'pending');

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setStatus(initial?.status || 'pending');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      <label>
        <div>Title</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        />
      </label>
      <label>
        <div>Description</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        />
      </label>
      <label>
        <div>Status</div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        >
          <option value="pending">pending</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={submitting}
        style={{ padding: '8px 12px', borderRadius: 6, background: '#222', color: '#fff' }}
      >
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}