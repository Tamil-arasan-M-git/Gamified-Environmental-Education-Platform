const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getCollection } = require('../utils/mockDb');

const SALT = bcrypt.genSaltSync(10);

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'eco_education_jwt_secret_key_2024', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, role, language } = req.body;
    const users = getCollection('users');

    // Check if user already exists
    const existingUser = users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = users.insertOne({
      name,
      email,
      password: bcrypt.hashSync(password, SALT),
      age: parseInt(age),
      role: role || 'child',
      language: language || 'english',
      level: 1,
      xp: 0,
      coins: 0,
      stars: 0,
      streak: 0,
      theme: 'light',
      avatar: 'default-avatar.png',
      completedLessons: [],
      achievements: [],
      badges: [],
      totalTimeSpent: 0,
      lastLoginDate: new Date().toISOString(),
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const users = getCollection('users');
    const user = users.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update streak
    const lastLogin = new Date(user.lastLoginDate || Date.now());
    const today = new Date();
    const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
    let newStreak = user.streak || 0;

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }

    users.updateOne({ email }, { $set: { streak: newStreak, lastLoginDate: today.toISOString() } });
    user.streak = newStreak;
    user.lastLoginDate = today.toISOString();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Logout user
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const users = getCollection('users');
    const user = users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = async (req, res) => {
  try {
    const users = getCollection('users');
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.language) updates.language = req.body.language;
    if (req.body.theme) updates.theme = req.body.theme;
    if (req.body.avatar) updates.avatar = req.body.avatar;

    const user = users.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const users = getCollection('users');
    const user = users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = bcrypt.compareSync(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    users.updateOne({ _id: req.user.id }, { $set: { password: bcrypt.hashSync(req.body.newPassword, SALT) } });
    const token = generateToken(user);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const users = getCollection('users');
    const user = users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    users.updateOne({ email: req.body.email }, { $set: { resetPasswordToken: crypto.createHash('sha256').update(resetToken).digest('hex'), resetPasswordExpire: Date.now() + 10 * 60 * 1000 } });
    res.status(200).json({ success: true, message: 'Password reset email sent', resetToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const users = getCollection('users');
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = users.findOne({ resetPasswordToken });
    if (!user || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    users.updateOne({ _id: user._id }, { $set: { password: bcrypt.hashSync(req.body.password, SALT), resetPasswordToken: undefined, resetPasswordExpire: undefined } });
    const token = generateToken(user);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};