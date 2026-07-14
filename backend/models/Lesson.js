const mongoose = require('mongoose');

/**
 * Lesson Schema
 * Stores environmental education modules with multi-language support
 */
const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['trees', 'water', 'earth', 'recycling', 'animals', 'energy', 'oceans', 'plants'],
  },
  icon: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  order: {
    type: Number,
    required: true,
  },
  // Multi-language content
  content: {
    english: {
      title: String,
      description: String,
      explanation: String,
      vocabulary: [{
        word: String,
        meaning: String,
        translation: String,
      }],
      miniStory: {
        title: String,
        content: String,
        moral: String,
      },
      funFacts: [String],
    },
    tamil: {
      title: String,
      description: String,
      explanation: String,
      vocabulary: [{
        word: String,
        meaning: String,
        translation: String,
      }],
      miniStory: {
        title: String,
        content: String,
        moral: String,
      },
      funFacts: [String],
    },
    hindi: {
      title: String,
      description: String,
      explanation: String,
      vocabulary: [{
        word: String,
        meaning: String,
        translation: String,
      }],
      miniStory: {
        title: String,
        content: String,
        moral: String,
      },
      funFacts: [String],
    },
  },
  images: [{
    url: String,
    alt: String,
    caption: String,
  }],
  audioUrl: {
    type: String,
    default: null,
  },
  xpReward: {
    type: Number,
    default: 20,
  },
  coinReward: {
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

module.exports = mongoose.model('Lesson', LessonSchema);