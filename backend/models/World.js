const mongoose = require('mongoose');

const WorldSchema = new mongoose.Schema({
  name: { english: String, tamil: String, hindi: String },
  icon: String,
  order: { type: Number, required: true },
  description: { english: String, tamil: String, hindi: String },
  requiredXp: { type: Number, default: 0 },
  isUnlocked: { type: Boolean, default: false },
  bossQuizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  totalLessons: { type: Number, default: 15 },
  totalGames: { type: Number, default: 5 },
  imageUrl: String,
  color: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('World', WorldSchema);