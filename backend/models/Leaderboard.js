const mongoose = require('mongoose');

/**
 * Leaderboard Schema
 * Tracks player rankings weekly and monthly
 */
const LeaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'default-avatar.png',
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  coins: {
    type: Number,
    default: 0,
  },
  weeklyXp: {
    type: Number,
    default: 0,
  },
  monthlyXp: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  weekStart: {
    type: Date,
  },
  monthStart: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one entry per user per period
LeaderboardSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);