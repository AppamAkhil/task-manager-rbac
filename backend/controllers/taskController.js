const db = require('../models');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('').max(1000).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'done').optional()
});

exports.getTasks = (req, res) => {
  const { role, id } = req.user;
  const { q, status, limit = 20, offset = 0 } = req.query;

  const filters = [];
  const params = [];

  let baseQuery = `SELECT * FROM tasks`;
  if (role !== 'admin') {
    baseQuery += ` WHERE createdBy = ?`;
    params.push(id);
  } else {
    baseQuery += ` WHERE 1=1`;
  }

  if (q) {
    filters.push(`(title LIKE ? OR description LIKE ?)`);
    params.push(`%${q}%`, `%${q}%`);
  }
  if (status) {
    filters.push(`status = ?`);
    params.push(status);
  }

  if (filters.length) {
    baseQuery += ` AND ` + filters.join(' AND ');
  }

  baseQuery += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  db.all(baseQuery, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
};

exports.getTaskById = (req, res) => {
  const { id: userId, role } = req.user;
  const taskId = req.params.id;

  db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (role !== 'admin' && task.createdBy !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(task);
  });
};

exports.createTask = (req, res) => {
  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { title, description, status } = value;

  db.run(
    `INSERT INTO tasks (title, description, status, createdBy) VALUES (?, ?, ?, ?)`,
    [title, description || '', status || 'pending', req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB insert error' });
      db.get(`SELECT * FROM tasks WHERE id = ?`, [this.lastID], (getErr, task) => {
        if (getErr) return res.status(500).json({ message: 'DB fetch error' });
        res.status(201).json(task);
      });
    }
  );
};

exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { id: userId, role } = req.user;

  db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (role !== 'admin' && task.createdBy !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { error, value } = taskSchema.fork(['title'], (schema) => schema.optional()).validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = {
      title: value.title ?? task.title,
      description: value.description ?? task.description,
      status: value.status ?? task.status
    };

    db.run(
      `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`,
      [updated.title, updated.description, updated.status, taskId],
      function (updateErr) {
        if (updateErr) return res.status(500).json({ message: 'DB update error' });
        db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (getErr, updatedTask) => {
          if (getErr) return res.status(500).json({ message: 'DB fetch error' });
          res.json(updatedTask);
        });
      }
    );
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  const { id: userId, role } = req.user;

  db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (role !== 'admin' && task.createdBy !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], function (delErr) {
      if (delErr) return res.status(500).json({ message: 'DB delete error' });
      res.json({ message: 'Task deleted' });
    });
  });
};