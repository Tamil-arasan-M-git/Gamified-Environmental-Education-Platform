const { getCollection } = require('../utils/mockDb');

exports.getProgress = async (req, res) => {
  try {
    const users = getCollection('users');
    const user = users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const lessons = getCollection('lessons');
    const totalLessons = lessons.find({ isActive: true }).length;

    const progress = {
      level: user.level || 1,
      xp: user.xp || 0,
      xpForNextLevel: (user.level || 1) * 100,
      coins: user.coins || 0,
      stars: user.stars || 0,
      streak: user.streak || 0,
      completedLessons: user.completedLessons?.length || 0,
      totalLessons,
      completionPercentage: totalLessons > 0 ? Math.round(((user.completedLessons?.length || 0) / totalLessons) * 100) : 0,
      achievements: user.achievements || [],
      badges: user.badges || [],
      totalTimeSpent: user.totalTimeSpent || 0,
      lastLoginDate: user.lastLoginDate,
    };

    res.status(200).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeLesson = async (req, res) => {
  try {
    const { lessonId, score } = req.body;
    const users = getCollection('users');
    const lessons = getCollection('lessons');
    const lesson = lessons.findById(lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    const user = users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const alreadyCompleted = user.completedLessons?.find(cl => cl.lessonId === lessonId);
    if (!alreadyCompleted) {
      const completedLesson = { lessonId, score: score || 100, completedAt: new Date().toISOString() };
      users.updateOne({ _id: req.user.id }, {
        $push: { completedLessons: completedLesson },
        $inc: { xp: lesson.xpReward || 20, coins: lesson.coinReward || 10 },
      });
    }

    res.status(200).json({
      success: true,
      xpEarned: alreadyCompleted ? 0 : lesson.xpReward || 20,
      coinsEarned: alreadyCompleted ? 0 : lesson.coinReward || 10,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChildrenProgress = async (req, res) => {
  try {
    const users = getCollection('users');
    const children = users.find({ parentId: req.user.id });
    const lessons = getCollection('lessons');
    const totalLessons = lessons.find({ isActive: true }).length;

    const progressData = children.map(child => ({
      _id: child._id,
      name: child.name,
      age: child.age,
      avatar: child.avatar,
      level: child.level || 1,
      xp: child.xp || 0,
      coins: child.coins || 0,
      stars: child.stars || 0,
      streak: child.streak || 0,
      completedCount: child.completedLessons?.length || 0,
      totalLessons,
      completionPercentage: totalLessons > 0 ? Math.round(((child.completedLessons?.length || 0) / totalLessons) * 100) : 0,
      achievements: child.achievements || [],
      badges: child.badges || [],
      totalTimeSpent: child.totalTimeSpent || 0,
      lastLoginDate: child.lastLoginDate,
    }));

    res.status(200).json({ success: true, children: progressData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTimeSpent = async (req, res) => {
  try {
    const { minutes } = req.body;
    const users = getCollection('users');
    users.updateOne({ _id: req.user.id }, { $inc: { totalTimeSpent: minutes || 0 } });
    res.status(200).json({ success: true, totalTimeSpent: (req.user.totalTimeSpent || 0) + (minutes || 0) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};