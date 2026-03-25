const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/student');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Adaptive Learning Platform API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST   /api/student/:studentId/attempt`);
  console.log(`   GET    /api/student/:studentId/progress`);
  console.log(`   GET    /api/student/:studentId/review`);
});