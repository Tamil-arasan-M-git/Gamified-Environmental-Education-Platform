const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: './.env' });

const { connectDB } = require('./config/db');
connectDB();

const auth = require('./routes/auth');
const lessons = require('./routes/lessons');
const quizzes = require('./routes/quizzes');
const games = require('./routes/games');
const leaderboard = require('./routes/leaderboard');
const progress = require('./routes/progress');
const admin = require('./routes/admin');
const dailyChallenge = require('./routes/dailyChallenge');
const worlds = require('./routes/worlds');
const garden = require('./routes/garden');
const ai = require('./routes/ai');
const questions = require('./routes/questions');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));

app.use('/api/auth', auth);
app.use('/api/lessons', lessons);
app.use('/api/quizzes', quizzes);
app.use('/api/games', games);
app.use('/api/leaderboard', leaderboard);
app.use('/api/progress', progress);
app.use('/api/admin', admin);
app.use('/api/daily-challenge', dailyChallenge);
app.use('/api/worlds', worlds);
app.use('/api/garden', garden);
app.use('/api/ai', ai);
app.use('/api/questions', questions);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'EcoLearn API v3.0 - 12,000+ Questions Available', version: '3.0.0' });
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Auto-seed questions and lessons
  const { getCollection } = require('./utils/mockDb');
  const questionsCol = getCollection('questions');
  if (questionsCol.countDocuments() < 4000) {
    questionsCol.deleteMany({});
    console.log('📦 Generating 4800+ question bank...');
    const { generateAllQuestions } = require('./seeds/questionGenerator');
    const qs = generateAllQuestions();
    qs.forEach(q => questionsCol.insertOne(q));
    const easy = qs.filter(q => q.difficulty === 'easy').length;
    const med = qs.filter(q => q.difficulty === 'medium').length;
    const hard = qs.filter(q => q.difficulty === 'hard').length;
    console.log(`✅ ${qs.length} total questions (${easy} easy, ${med} medium, ${hard} hard)`);
  }
  // Seed 780 lessons (30 per category × 26 categories)
  const lessonsCol = getCollection('lessons');
  if (lessonsCol.countDocuments() < 100) {
    lessonsCol.deleteMany({});
    console.log('📦 Generating 780 lessons...');
    const { generateLessons } = require('./seeds/lessonGenerator');
    const ls = generateLessons();
    ls.forEach(l => lessonsCol.insertOne(l));
    console.log(`✅ ${ls.length} lessons generated across 26 categories`);
  }
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});