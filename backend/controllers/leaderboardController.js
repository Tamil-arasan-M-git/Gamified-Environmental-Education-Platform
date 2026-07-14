const { getCollection } = require('../utils/mockDb');

exports.getLeaderboard = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const users = getCollection('users');
    let allUsers = users.find({});
    
    // Sort by XP descending
    allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    allUsers = allUsers.slice(0, 100);

    const leaderboard = allUsers.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      name: user.name,
      avatar: user.avatar || 'default-avatar.png',
      level: user.level || 1,
      xp: user.xp || 0,
      coins: user.coins || 0,
      streak: user.streak || 0,
    }));

    res.status(200).json({ success: true, count: leaderboard.length, leaderboard, period });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyPosition = async (req, res) => {
  try {
    const users = getCollection('users');
    const allUsers = users.find({});
    allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    
    const myIndex = allUsers.findIndex(u => u._id === req.user.id);
    const rank = myIndex !== -1 ? myIndex + 1 : allUsers.length + 1;
    const total = allUsers.length;

    res.status(200).json({
      success: true,
      rank,
      total,
      topPercentile: total > 0 ? ((total - rank) / total * 100).toFixed(1) : '0',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};