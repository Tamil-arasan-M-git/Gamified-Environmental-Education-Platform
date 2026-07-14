const { getCollection } = require('../utils/mockDb');

exports.getWorlds = async (req, res) => {
  try {
    const worlds = getCollection('worlds');
    const allWorlds = worlds.find({ isActive: true }).sort((a, b) => a.order - b.order);
    const user = req.user;
    const lang = user?.language || 'english';

    const result = allWorlds.map((w, i) => ({
      ...w,
      localizedName: w.name?.[lang] || w.name?.english,
      localizedDescription: w.description?.[lang] || w.description?.english,
      isUnlocked: (user?.xp || 0) >= (w.requiredXp || 0) || i === 0,
      progress: Math.min(100, Math.round(((user?.completedLessons?.length || 0) / (w.totalLessons || 15)) * 100)),
    }));

    res.status(200).json({ success: true, worlds: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.seedWorlds = async (req, res) => {
  try {
    const worlds = getCollection('worlds');
    if (worlds.countDocuments() > 0) return res.json({ success: true, message: 'Already seeded' });
    
    const data = [
      { name: { english: 'Forest World', tamil: 'காடு உலகம்', hindi: 'वन दुनिया' }, icon: '🌳', order: 1, description: { english: 'Learn about trees, forests, and plants', tamil: 'மரங்கள், காடுகள் மற்றும் தாவரங்கள் பற்றி அறிக', hindi: 'पेड़ों, जंगलों और पौधों के बारे में जानें' }, requiredXp: 0, color: '#4CAF50', totalLessons: 20 },
      { name: { english: 'Ocean World', tamil: 'கடல் உலகம்', hindi: 'महासागर दुनिया' }, icon: '🌊', order: 2, description: { english: 'Dive into oceans, rivers, and water life', tamil: 'கடல்கள், ஆறுகள் மற்றும் நீர் வாழ்க்கையில் மூழ்குங்கள்', hindi: 'महासागरों, नदियों और जल जीवन में गोता लगाएं' }, requiredXp: 500, color: '#2196F3', totalLessons: 20 },
      { name: { english: 'Mountain World', tamil: 'மலை உலகம்', hindi: 'पर्वत दुनिया' }, icon: '🏔️', order: 3, description: { english: 'Explore mountains, rocks, and soil', tamil: 'மலைகள், பாறைகள் மற்றும் மண்ணை ஆராயுங்கள்', hindi: 'पहाड़ों, चट्टानों और मिट्टी का अन्वेषण करें' }, requiredXp: 1200, color: '#795548', totalLessons: 15 },
      { name: { english: 'Wildlife World', tamil: 'வனவிலங்கு உலகம்', hindi: 'वन्यजीव दुनिया' }, icon: '🐯', order: 4, description: { english: 'Discover animals, birds, and habitats', tamil: 'விலங்குகள், பறவைகள் மற்றும் வாழ்விடங்களைக் கண்டறியுங்கள்', hindi: 'जानवरों, पक्षियों और आवासों की खोज करें' }, requiredXp: 2500, color: '#FF9800', totalLessons: 20 },
      { name: { english: 'Recycling City', tamil: 'மறுசுழற்சி நகரம்', hindi: 'रीसाइक्लिंग सिटी' }, icon: '♻️', order: 5, description: { english: 'Learn to reduce, reuse, and recycle', tamil: 'குறைத்தல், மறுபயன்பாடு மற்றும் மறுசுழற்சி பற்றி அறிக', hindi: 'कम करना, पुन: उपयोग और रीसाइकिल करना सीखें' }, requiredXp: 4000, color: '#9C27B0', totalLessons: 15 },
      { name: { english: 'Green Energy World', tamil: 'பசுமை ஆற்றல் உலகம்', hindi: 'हरित ऊर्जा दुनिया' }, icon: '☀️', order: 6, description: { english: 'Explore solar, wind, and renewable energy', tamil: 'சூரிய, காற்று மற்றும் புதுப்பிக்கத்தக்க ஆற்றலை ஆராயுங்கள்', hindi: 'सौर, पवन और नवीकरणीय ऊर्जा का अन्वेषण करें' }, requiredXp: 6000, color: '#FFEB3B', totalLessons: 15 },
      { name: { english: 'Earth Protection World', tamil: 'பூமி பாதுகாப்பு உலகம்', hindi: 'पृथ्वी संरक्षण दुनिया' }, icon: '🌍', order: 7, description: { english: 'Save the planet with eco-friendly actions', tamil: 'சூழல் நட்பு செயல்களால் கிரகத்தை காப்பாற்றுங்கள்', hindi: 'इको-फ्रेंडली कार्यों से ग्रह बचाएं' }, requiredXp: 8500, color: '#E91E63', totalLessons: 20 },
    ];
    data.forEach(d => worlds.insertOne({ ...d, isActive: true }));
    res.status(200).json({ success: true, message: `🌍 ${data.length} worlds seeded` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};