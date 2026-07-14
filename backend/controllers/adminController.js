const { getCollection } = require('../utils/mockDb');

exports.getDashboard = async (req, res) => {
  try {
    const users = getCollection('users');
    const lessons = getCollection('lessons');
    const quizzes = getCollection('quizzes');
    const games = getCollection('games');
    
    const allUsers = users.find({});
    const totalUsers = allUsers.length;
    const totalChildren = allUsers.filter(u => u.role === 'child').length;
    const totalParents = allUsers.filter(u => u.role === 'parent').length;
    const totalLessons = lessons.find({ isActive: true }).length;
    const totalQuizzes = quizzes.find({ isActive: true }).length;
    const totalGames = games.find({ isActive: true }).length;
    const totalXp = allUsers.reduce((sum, u) => sum + (u.xp || 0), 0);

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalChildren, totalParents, totalLessons, totalQuizzes, totalGames, totalXp },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = getCollection('users');
    const allUsers = users.find({});
    const sanitized = allUsers.map(({ password, ...rest }) => rest);
    res.status(200).json({ success: true, count: sanitized.length, users: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const users = getCollection('users');
    const user = users.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const users = getCollection('users');
    const user = users.findByIdAndUpdate(req.params.id, { $set: { role } }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password, ...rest } = user;
    res.status(200).json({ success: true, user: rest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};