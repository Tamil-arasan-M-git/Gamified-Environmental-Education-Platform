const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'true-false', 'fill-blank', 'who-am-i', 'memory-match', 'drag-drop', 'image-quiz'], default: 'multiple-choice' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  category: { type: String, required: true },
  answer: mongoose.Schema.Types.Mixed,
  options: [String],
  correctAnswer: Number,
  explanation: String,
  imageUrl: String,
  audioUrl: String,
  tags: [String],
  xpReward: { type: Number, default: 10 },
  coinReward: { type: Number, default: 5 },
  timesAnswered: { type: Number, default: 0 },
  timesCorrect: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ type: 1 });

module.exports = mongoose.model('Questions', QuestionSchema);