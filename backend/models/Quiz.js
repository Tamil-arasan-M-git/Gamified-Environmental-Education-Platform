const mongoose = require('mongoose');

/**
 * Quiz Schema
 * Stores quiz questions for environmental education
 */
const QuizSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  question: {
    english: {
      text: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
    tamil: {
      text: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
    hindi: {
      text: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-blank', 'word-puzzle'],
    default: 'multiple-choice',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  imageUrl: {
    type: String,
    default: null,
  },
  xpReward: {
    type: Number,
    default: 10,
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

module.exports = mongoose.model('Quiz', QuizSchema);