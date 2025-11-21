require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); // ensures tables are created

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});