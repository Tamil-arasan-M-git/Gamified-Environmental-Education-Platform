const mongoose = require('mongoose');

/**
 * DailyChallenge Schema
 * Stores daily challenges for bonus rewards
 */
const DailyChallengeSchema = new mongoose.Schema({
  title: {
    english: String,
    tamil: String,
    hindi: String,
  },
  description: {
    english: String,
    tamil: String,
    hindi: String,
  },
  challengeType: {
    type: String,
    enum: ['quiz', 'game', 'lesson', 'streak'],
    required: true,
  },
  category: {
    type: String,
    enum: ['trees', 'water', 'earth', 'recycling', 'animals', 'energy', 'oceans', 'plants', 'general'],
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can reference Lesson, Quiz, or Game
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  coinReward: {
    type: Number,
    default: 30,
  },
  date: {
    type: Date,
    required: true,
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

// Ensure only one challenge per day
DailyChallengeSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('DailyChallenge', DailyChallengeSchema);