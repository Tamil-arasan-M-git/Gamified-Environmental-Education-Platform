const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Schema
 * Stores all user information including gamification data
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
    min: [3, 'Must be at least 3 years old'],
    max: [18, 'Must be under 18 years old'],
  },
  role: {
    type: String,
    enum: ['child', 'parent', 'admin'],
    default: 'child',
  },
  // Gamification fields
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  coins: {
    type: Number,
    default: 0,
  },
  stars: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastLoginDate: {
    type: Date,
    default: Date.now,
  },
  // Avatar customization
  avatar: {
    type: String,
    default: 'default-avatar.png',
  },
  // Selected language preference
  language: {
    type: String,
    enum: ['english', 'tamil', 'hindi'],
    default: 'english',
  },
  // Theme preference
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  // Parent-child relationship
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  achievements: [{
    type: String,
  }],
  badges: [{
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    score: Number,
  }],
  totalTimeSpent: {
    type: Number,
    default: 0, // in minutes
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get total XP needed for next level
UserSchema.methods.getXpForNextLevel = function () {
  return this.level * 100;
};

// Check if user can level up
UserSchema.methods.checkLevelUp = function () {
  const xpNeeded = this.getXpForNextLevel();
  if (this.xp >= xpNeeded) {
    this.xp = this.xp - xpNeeded;
    this.level += 1;
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema);