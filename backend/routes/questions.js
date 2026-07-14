const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCollection } = require('../utils/mockDb');

// GET /api/questions - get questions with filters
router.get('/', protect, (req, res) => {
  try {
    const { category, difficulty, type, limit = 10 } = req.query;
    const questions = getCollection('questions');
    let results = questions.find({ isActive: true });
    
    if (category) results = results.filter(q => q.category === category);
    if (difficulty) results = results.filter(q => q.difficulty === difficulty);
    if (type) results = results.filter(q => q.type === type);
    
    // Shuffle for randomness
    results.sort(() => Math.random() - 0.5);
    results = results.slice(0, parseInt(limit));
    
    res.status(200).json({ success: true, count: results.length, questions: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/questions/random - get random questions
router.get('/random', protect, (req, res) => {
  try {
    const { count = 10, difficulty } = req.query;
    const questions = getCollection('questions');
    let results = questions.find({ isActive: true });
    if (difficulty) results = results.filter(q => q.difficulty === difficulty);
    results.sort(() => Math.random() - 0.5);
    results = results.slice(0, parseInt(count));
    res.status(200).json({ success: true, count: results.length, questions: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/questions/category/:category
router.get('/category/:category', protect, (req, res) => {
  try {
    const { difficulty } = req.query;
    const questions = getCollection('questions');
    let results = questions.find({ category: req.params.category, isActive: true });
    if (difficulty) results = results.filter(q => q.difficulty === difficulty);
    results.sort(() => Math.random() - 0.5);
    res.status(200).json({ success: true, count: results.length, questions: results.slice(0, 50) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/questions/game/:gameType
router.get('/game/:gameType', protect, (req, res) => {
  try {
    const { difficulty, limit = 10 } = req.query;
    const questions = getCollection('questions');
    let results = questions.find({ isActive: true });
    if (difficulty) results = results.filter(q => q.difficulty === difficulty);
    
    // Map game type to question type
    const typeMap = { 'image-quiz': 'multiple-choice', 'true-false': 'true-false', 'word-puzzle': 'fill-blank', 'memory-card': 'multiple-choice' };
    const qType = typeMap[req.params.gameType];
    if (qType) results = results.filter(q => q.type === qType);
    
    results.sort(() => Math.random() - 0.5);
    results = results.slice(0, parseInt(limit));
    res.status(200).json({ success: true, count: results.length, questions: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/categories - list all categories
router.get('/categories', protect, (req, res) => {
  const categories = [
    { id: 'trees', name: 'Trees', icon: '🌳', color: '#4CAF50' },
    { id: 'water', name: 'Water', icon: '💧', color: '#2196F3' },
    { id: 'earth', name: 'Earth', icon: '🌍', color: '#795548' },
    { id: 'recycling', name: 'Recycling', icon: '♻️', color: '#9C27B0' },
    { id: 'animals', name: 'Animals', icon: '🐯', color: '#FF9800' },
    { id: 'energy', name: 'Energy', icon: '⚡', color: '#FFEB3B' },
    { id: 'oceans', name: 'Oceans', icon: '🌊', color: '#00BCD4' },
    { id: 'plants', name: 'Plants', icon: '🌱', color: '#8BC34A' },
    { id: 'forests', name: 'Forests', icon: '🏞️', color: '#2E7D32' },
    { id: 'wildlife', name: 'Wildlife', icon: '🦁', color: '#E65100' },
    { id: 'climate', name: 'Climate', icon: '🌤️', color: '#607D8B' },
    { id: 'weather', name: 'Weather', icon: '⛅', color: '#90CAF9' },
  ];
  res.status(200).json({ success: true, categories });
});

module.exports = router;