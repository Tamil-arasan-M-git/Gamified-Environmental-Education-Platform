const { getCollection } = require('../utils/mockDb');

exports.getLessons = async (req, res) => {
  try {
    const { category, difficulty, language } = req.query;
    const lessons = getCollection('lessons');
    let results = lessons.find({ isActive: true });
    if (category) results = results.filter(l => l.category === category);
    if (difficulty) results = results.filter(l => l.difficulty === difficulty);
    results.sort((a, b) => a.order - b.order);

    const lang = language || req.user?.language || 'english';
    const formatted = results.map(lesson => ({
      ...lesson,
      localizedContent: lesson.content?.[lang] || lesson.content?.english,
    }));

    res.status(200).json({ success: true, count: results.length, lessons: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lessons = getCollection('lessons');
    const lesson = lessons.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    const lang = req.query.language || req.user?.language || 'english';
    res.status(200).json({
      success: true,
      lesson: { ...lesson, localizedContent: lesson.content?.[lang] || lesson.content?.english },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const lessons = getCollection('lessons');
    const lesson = lessons.insertOne({ ...req.body, isActive: true });
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lessons = getCollection('lessons');
    const lesson = lessons.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.status(200).json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lessons = getCollection('lessons');
    const lesson = lessons.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.status(200).json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'trees', name: '🌳 Trees', icon: '🌳' },
      { id: 'water', name: '💧 Water', icon: '💧' },
      { id: 'earth', name: '🌍 Earth', icon: '🌍' },
      { id: 'recycling', name: '♻ Recycling', icon: '♻' },
      { id: 'animals', name: '🐯 Animals', icon: '🐯' },
      { id: 'energy', name: '🌞 Energy', icon: '🌞' },
      { id: 'oceans', name: '🌊 Oceans', icon: '🌊' },
      { id: 'plants', name: '🌱 Plants', icon: '🌱' },
    ];
    const lessons = getCollection('lessons');
    const allLessons = lessons.find({ isActive: true });
    const categoriesWithCounts = categories.map(cat => ({
      ...cat,
      lessonCount: allLessons.filter(l => l.category === cat.id).length,
    }));
    res.status(200).json({ success: true, categories: categoriesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};