const { getCollection } = require('../utils/mockDb');

exports.getGames = async (req, res) => {
  try {
    const { gameType, category, difficulty } = req.query;
    const games = getCollection('games');
    let results = games.find({ isActive: true });
    if (gameType) results = results.filter(g => g.gameType === gameType);
    if (category) results = results.filter(g => g.category === category);
    if (difficulty) results = results.filter(g => g.difficulty === difficulty);
    const lang = req.query.language || req.user?.language || 'english';
    const formatted = results.map(g => ({
      ...g,
      localizedContent: g.content?.[lang] || g.content?.english,
      localizedTitle: g.title?.[lang] || g.title?.english,
      localizedInstructions: g.instructions?.[lang] || g.instructions?.english,
    }));
    res.status(200).json({ success: true, count: results.length, games: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGame = async (req, res) => {
  try {
    const games = getCollection('games');
    const game = games.findById(req.params.id);
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    const lang = req.query.language || req.user?.language || 'english';
    res.status(200).json({
      success: true,
      game: {
        ...game,
        localizedContent: game.content?.[lang] || game.content?.english,
        localizedTitle: game.title?.[lang] || game.title?.english,
        localizedInstructions: game.instructions?.[lang] || game.instructions?.english,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGame = async (req, res) => {
  try {
    const games = getCollection('games');
    const game = games.insertOne({ ...req.body, isActive: true });
    res.status(201).json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const games = getCollection('games');
    const game = games.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    res.status(200).json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const games = getCollection('games');
    const game = games.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });
    res.status(200).json({ success: true, message: 'Game deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeGame = async (req, res) => {
  try {
    const { score, gameId } = req.body;
    const games = getCollection('games');
    const game = games.findById(gameId);
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });

    const users = getCollection('users');
    const user = users.findById(req.user.id);
    if (user) {
      users.updateOne({ _id: req.user.id }, { $inc: { xp: game.xpReward, coins: game.coinReward, stars: 1 } });
    }

    res.status(200).json({
      success: true,
      xpEarned: game.xpReward,
      coinsEarned: game.coinReward,
      starsEarned: 1,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};