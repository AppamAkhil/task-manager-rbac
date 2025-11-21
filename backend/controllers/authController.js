const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('user', 'admin').optional()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password, role } = value;

    db.get(`SELECT id FROM users WHERE username = ?`, [username], async (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (row) return res.status(400).json({ message: 'Username already exists' });

      const hashed = await bcrypt.hash(password, 10);
      db.run(
        `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
        [username, hashed, role || 'user'],
        function (insertErr) {
          if (insertErr) return res.status(500).json({ message: 'DB insert error' });
          res.status(201).json({ id: this.lastID, username, role: role || 'user' });
        }
      );
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = value;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role }
      });
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};