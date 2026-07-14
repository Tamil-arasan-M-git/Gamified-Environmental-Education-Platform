const mongoose = require('mongoose');

/**
 * Achievement Schema
 * Defines achievements that players can earn
 */
const AchievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide achievement name'],
  },
  description: {
    type: String,
    required: [true, 'Please provide achievement description'],
  },
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['streak', 'lessons', 'quizzes', 'games', 'xp', 'coins', 'special'],
    required: true,
  },
  requirement: {
    type: Number, // e.g., 5 days streak, 10 lessons completed
    required: true,
  },
  rewardXp: {
    type: Number,
    default: 50,
  },
  rewardCoins: {
    type: Number,
    default: 25,
  },
  badgeName: {
    type: String,
    default: null,
  },
  language: {
    english: { name: String, description: String },
    tamil: { name: String, description: String },
    hindi: { name: String, description: String },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Achievement', AchievementSchema);