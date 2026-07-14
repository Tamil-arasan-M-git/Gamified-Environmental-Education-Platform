const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getCollection } = require('../utils/mockDb');

let useMockDb = false;
let mockConnected = false;

/**
 * Connect to MongoDB or fallback to file-based storage
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected`);
    useMockDb = false;
    return true;
  } catch (error) {
    console.log(`⚠️ MongoDB not available. Using file-based storage.`);
    useMockDb = true;
    mockConnected = true;
    
    // Auto-seed demo data on first run
    seedMockData();
    return true;
  }
};

/**
 * Seed demo users into mock database
 */
function seedMockData() {
  const users = getCollection('users');
  if (users.countDocuments() > 0) return;

  console.log('📦 Seeding demo data...');
  
  const salt = bcrypt.genSaltSync(10);
  
  // Create admin user
  const adminId = 'admin001';
  users.insertOne({
    _id: adminId,
    name: 'Admin',
    email: 'admin@ecolearn.com',
    password: bcrypt.hashSync('admin123', salt),
    age: 25,
    role: 'admin',
    level: 5,
    xp: 1000,
    coins: 500,
    stars: 10,
    streak: 5,
    language: 'english',
    theme: 'light',
    avatar: 'default-avatar.png',
    completedLessons: [],
    achievements: ['First Steps', 'Eco Champion'],
    badges: [{ name: 'Gold Badge', earnedAt: new Date().toISOString() }],
    totalTimeSpent: 120,
    lastLoginDate: new Date().toISOString(),
  });

  // Create child user
  const kidId = 'kid001';
  users.insertOne({
    _id: kidId,
    name: 'Eco Kid',
    email: 'kid@ecolearn.com',
    password: bcrypt.hashSync('kid123', salt),
    age: 8,
    role: 'child',
    level: 2,
    xp: 250,
    coins: 120,
    stars: 5,
    streak: 3,
    language: 'english',
    theme: 'light',
    avatar: 'default-avatar.png',
    completedLessons: [],
    achievements: ['First Steps'],
    badges: [{ name: 'Beginner Badge', earnedAt: new Date().toISOString() }],
    totalTimeSpent: 45,
    lastLoginDate: new Date().toISOString(),
  });

  // Load expanded lessons from seed file
  const lessons = getCollection('lessons');
  if (lessons.countDocuments() === 0) {
    const lessonsData = require('../seeds/lessons-seed');
    lessonsData.forEach(lesson => {
      lessons.insertOne({ ...lesson, isActive: true });
    });
    console.log(`   📚 ${lessonsData.length} lessons loaded`);
  }

  // Load games from seed file
  const games = getCollection('games');
  if (games.countDocuments() === 0) {
    const gamesData = require('../seeds/games-seed');
    gamesData.forEach(game => {
      games.insertOne({ ...game, isActive: true });
    });
    console.log(`   🎮 ${gamesData.length} games loaded`);
  }

  // Create sample quizzes
  const quizzes = getCollection('quizzes');
  if (quizzes.countDocuments() === 0) {
    quizzes.insertMany([
      {
        lessonId: 'lesson1',
        question: {
          english: { text: 'What do trees give us to breathe?', options: ['Water', 'Oxygen', 'Food', 'Light'], correctAnswer: 1, explanation: 'Trees produce oxygen through photosynthesis!' },
          tamil: { text: 'மரங்கள் நமக்கு சுவாசிக்க எதைத் தருகின்றன?', options: ['தண்ணீர்', 'ஆக்ஸிஜன்', 'உணவு', 'ஒளி'], correctAnswer: 1, explanation: 'மரங்கள் ஒளிச்சேர்க்கை மூலம் ஆக்ஸிஜனை உற்பத்தி செய்கின்றன!' },
          hindi: { text: 'पेड़ हमें सांस लेने के लिए क्या देते हैं?', options: ['पानी', 'ऑक्सीजन', 'भोजन', 'रोशनी'], correctAnswer: 1, explanation: 'पेड़ प्रकाश संश्लेषण के माध्यम से ऑक्सीजन का उत्पादन करते हैं!' },
        },
        questionType: 'multiple-choice',
        difficulty: 'easy',
        isActive: true,
        xpReward: 10,
      },
      {
        lessonId: 'lesson1',
        question: {
          english: { text: 'Trees produce oxygen. Is this true?', options: ['True', 'False'], correctAnswer: 0, explanation: 'Yes! Trees take in CO2 and release oxygen.' },
          tamil: { text: 'மரங்கள் ஆக்ஸிஜனை உற்பத்தி செய்கின்றன. இது உண்மையா?', options: ['உண்மை', 'தவறு'], correctAnswer: 0, explanation: 'ஆம்! மரங்கள் CO2 ஐ எடுத்து ஆக்ஸிஜனை வெளியிடுகின்றன.' },
          hindi: { text: 'पेड़ ऑक्सीजन का उत्पादन करते हैं। क्या यह सच है?', options: ['सच', 'झूठ'], correctAnswer: 0, explanation: 'हाँ! पेड़ CO2 लेते हैं और ऑक्सीजन छोड़ते हैं।' },
        },
        questionType: 'true-false',
        difficulty: 'easy',
        isActive: true,
        xpReward: 10,
      },
    ]);
  }

  console.log('✅ Demo data seeded successfully!');
  console.log('   Admin: admin@ecolearn.com / admin123');
  console.log('   Kid:   kid@ecolearn.com / kid123');
}

/**
 * Get the User model - works with both MongoDB and mock DB
 */
function getUserModel() {
  if (!useMockDb) {
    return require('../models/User');
  }
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const { getCollection } = require('../utils/mockDb');

  const users = getCollection('users');
  
  // Extend with mongoose-like methods
  return {
    findOne: (query) => users.findOne(query),
    findById: (id) => users.findById(id),
    find: (query) => ({ ...users, _results: users.find(query), select: function() { return this; }, sort: function() { return this; }, limit: function() { return this; }, lean: function() { return this._results || users.find(query); }, then: function(cb) { return Promise.resolve(users.find(query)).then(cb); } }),
    create: (data) => users.insertOne(data),
    findByIdAndUpdate: (id, update, options) => users.findByIdAndUpdate(id, update, options),
    countDocuments: (query) => users.countDocuments(query),
    aggregate: (pipeline) => users.aggregate(pipeline),
  };
}

module.exports = { connectDB, useMockDb: () => useMockDb, getUserModel };