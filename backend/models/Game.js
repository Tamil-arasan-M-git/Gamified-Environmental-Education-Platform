const mongoose = require('mongoose');

/**
 * Game Schema
 * Stores different types of educational games
 */
const GameSchema = new mongoose.Schema({
  title: {
    english: String,
    tamil: String,
    hindi: String,
  },
  gameType: {
    type: String,
    enum: ['image-quiz', 'drag-drop', 'memory-card', 'word-puzzle', 'fill-blank', 'true-false'],
    required: [true, 'Please specify game type'],
  },
  category: {
    type: String,
    enum: ['trees', 'water', 'earth', 'recycling', 'animals', 'energy', 'oceans', 'plants'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  instructions: {
    english: String,
    tamil: String,
    hindi: String,
  },
  content: {
    english: {
      questions: [{
        imageUrl: String,
        questionText: String,
        options: [String],
        correctAnswer: Number,
        hint: String,
      }],
      dragItems: [{
        id: Number,
        label: String,
        imageUrl: String,
        category: String,
      }],
      cards: [{
        id: Number,
        imageUrl: String,
        label: String,
        matchId: Number,
      }],
      puzzle: {
        word: String,
        scrambled: String,
        hint: String,
      },
      fillBlank: {
        sentence: String,
        answer: String,
        options: [String],
      },
      trueFalse: [{
        statement: String,
        answer: Boolean,
        explanation: String,
      }],
    },
    tamil: {
      questions: [{
        imageUrl: String,
        questionText: String,
        options: [String],
        correctAnswer: Number,
        hint: String,
      }],
      dragItems: [{
        id: Number,
        label: String,
        imageUrl: String,
        category: String,
      }],
      cards: [{
        id: Number,
        imageUrl: String,
        label: String,
        matchId: Number,
      }],
      puzzle: {
        word: String,
        scrambled: String,
        hint: String,
      },
      fillBlank: {
        sentence: String,
        answer: String,
        options: [String],
      },
      trueFalse: [{
        statement: String,
        answer: Boolean,
        explanation: String,
      }],
    },
    hindi: {
      questions: [{
        imageUrl: String,
        questionText: String,
        options: [String],
        correctAnswer: Number,
        hint: String,
      }],
      dragItems: [{
        id: Number,
        label: String,
        imageUrl: String,
        category: String,
      }],
      cards: [{
        id: Number,
        imageUrl: String,
        label: String,
        matchId: Number,
      }],
      puzzle: {
        word: String,
        scrambled: String,
        hint: String,
      },
      fillBlank: {
        sentence: String,
        answer: String,
        options: [String],
      },
      trueFalse: [{
        statement: String,
        answer: Boolean,
        explanation: String,
      }],
    },
  },
  xpReward: {
    type: Number,
    default: 30,
  },
  coinReward: {
    type: Number,
    default: 15,
  },
  timeLimit: {
    type: Number, // in seconds
    default: 60,
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

module.exports = mongoose.model('Game', GameSchema);