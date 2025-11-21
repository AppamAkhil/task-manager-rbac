import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import TaskForm from '../components/TaskForm.jsx';

export default function CreateEditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTask = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await API.get(`/tasks/${id}`);
      setInitial(res.data);
    } catch (e) {
      alert('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submit = async (payload) => {
    setLoading(true);
    try {
      if (id) {
        await API.put(`/tasks/${id}`, payload);
        alert('Task updated');
      } else {
        await API.post('/tasks', payload);
        alert('Task created');
      }
      navigate('/');
    } catch (e) {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Task' : 'Create Task'}</h2>
      {id && !initial && loading && <p>Loading...</p>}
      <TaskForm initial={initial} onSubmit={submit} submitting={loading} />
    </div>
  );
}