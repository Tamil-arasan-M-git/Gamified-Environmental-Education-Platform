const { getCollection } = require('../utils/mockDb');

exports.getQuizzes = async (req, res) => {
  try {
    const { lessonId, difficulty } = req.query;
    const quizzes = getCollection('quizzes');
    let results = quizzes.find({ isActive: true });
    if (lessonId) results = results.filter(q => q.lessonId === lessonId);
    if (difficulty) results = results.filter(q => q.difficulty === difficulty);
    const lang = req.query.language || req.user?.language || 'english';
    const formatted = results.map(q => ({ ...q, localizedQuestion: q.question?.[lang] || q.question?.english }));
    res.status(200).json({ success: true, count: results.length, quizzes: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quizzes = getCollection('quizzes');
    const quiz = quizzes.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const lang = req.query.language || req.user?.language || 'english';
    res.status(200).json({ success: true, quiz: { ...quiz, localizedQuestion: quiz.question?.[lang] || quiz.question?.english } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const quizzes = getCollection('quizzes');
    const quiz = quizzes.insertOne({ ...req.body, isActive: true });
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quizzes = getCollection('quizzes');
    const quiz = quizzes.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quizzes = getCollection('quizzes');
    const quiz = quizzes.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.status(200).json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { quizId, answer } = req.body;
    const quizzes = getCollection('quizzes');
    const quiz = quizzes.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const isCorrect = quiz.question.english.correctAnswer === answer;
    const users = getCollection('users');
    const user = users.findById(req.user.id);

    if (isCorrect && user) {
      users.updateOne({ _id: req.user.id }, { $inc: { xp: quiz.xpReward, coins: 5 } });
      user.xp = (user.xp || 0) + quiz.xpReward;
      user.coins = (user.coins || 0) + 5;
    }

    res.status(200).json({
      success: true,
      isCorrect,
      correctAnswer: quiz.question.english.correctAnswer,
      xpEarned: isCorrect ? quiz.xpReward : 0,
      coinsEarned: isCorrect ? 5 : 0,
      explanation: quiz.question.english.explanation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};