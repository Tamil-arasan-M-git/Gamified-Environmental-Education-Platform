const { getCollection } = require('../utils/mockDb');

exports.getTodaysChallenge = async (req, res) => {
  try {
    const challenges = getCollection('dailyChallenges');
    const today = new Date().toISOString().split('T')[0];
    let challenge = challenges.find({ date: today })[0];

    if (!challenge) {
      const challengeTypes = ['quiz', 'game', 'lesson', 'streak'];
      const categories = ['trees', 'water', 'earth', 'recycling', 'animals', 'energy', 'oceans', 'plants'];
      challenge = challenges.insertOne({
        title: {
          english: 'Today\'s Eco Challenge',
          tamil: 'இன்றைய சுற்றுச்சூழல் சவால்',
          hindi: 'आज की पर्यावरण चुनौती',
        },
        description: {
          english: 'Complete today\'s challenge and earn bonus rewards!',
          tamil: 'இன்றைய சவாலை முடித்து போனஸ் வெகுமதிகளைப் பெறுங்கள்!',
          hindi: 'आज की चुनौती पूरी करें और बोनस पुरस्कार अर्जित करें!',
        },
        challengeType: challengeTypes[Math.floor(Math.random() * challengeTypes.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        xpReward: 50,
        coinReward: 30,
        date: today,
        isActive: true,
      });
    }

    const lang = req.user?.language || 'english';
    res.status(200).json({
      success: true,
      challenge: {
        ...challenge,
        localizedTitle: challenge.title?.[lang] || challenge.title?.english,
        localizedDescription: challenge.description?.[lang] || challenge.description?.english,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const challenges = getCollection('dailyChallenges');
    const challenge = challenges.findById(challengeId);
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });

    const users = getCollection('users');
    users.updateOne({ _id: req.user.id }, { $inc: { xp: challenge.xpReward || 50, coins: challenge.coinReward || 30 } });

    res.status(200).json({
      success: true,
      xpEarned: challenge.xpReward || 50,
      coinsEarned: challenge.coinReward || 30,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createChallenge = async (req, res) => {
  try {
    const challenges = getCollection('dailyChallenges');
    const challenge = challenges.insertOne(req.body);
    res.status(201).json({ success: true, challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};