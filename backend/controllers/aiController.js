const { getCollection } = require('../utils/mockDb');

/**
 * Adaptive Learning Engine - Analyzes user performance and provides recommendations
 */
exports.getAdaptiveLearning = async (req, res) => {
  try {
    const users = getCollection('users');
    const lessons = getCollection('lessons');
    const user = users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const completedLessonIds = (user.completedLessons || []).map(cl => cl.lessonId);
    const allLessons = lessons.find({ isActive: true });
    const notCompleted = allLessons.filter(l => !completedLessonIds.includes(l._id));

    // Calculate weak categories (categories where user has low completion)
    const categoryCompletion = {};
    allLessons.forEach(l => {
      if (!categoryCompletion[l.category]) categoryCompletion[l.category] = { total: 0, completed: 0 };
      categoryCompletion[l.category].total++;
      if (completedLessonIds.includes(l._id)) categoryCompletion[l.category].completed++;
    });

    const weakCategories = Object.entries(categoryCompletion)
      .filter(([_, data]) => data.total > 0 && (data.completed / data.total) < 0.4)
      .map(([cat]) => cat);

    const strongCategories = Object.entries(categoryCompletion)
      .filter(([_, data]) => data.total > 0 && (data.completed / data.total) > 0.8)
      .map(([cat]) => cat);

    // Recommend next lessons
    const recommendedLessons = notCompleted
      .sort((a, b) => {
        const aWeak = weakCategories.includes(a.category) ? -1 : 0;
        const bWeak = weakCategories.includes(b.category) ? -1 : 0;
        return aWeak - bWeak || a.order - b.order;
      })
      .slice(0, 5);

    // Determine difficulty recommendation
    const accuracy = user.completedLessons?.length > 0 
      ? (user.completedLessons.reduce((sum, cl) => sum + (cl.score || 0), 0) / user.completedLessons.length)
      : 0;
    
    let recommendedDifficulty = 'beginner';
    if (accuracy > 85) recommendedDifficulty = 'advanced';
    else if (accuracy > 60) recommendedDifficulty = 'intermediate';

    // Learning score calculation
    const totalLessons = allLessons.length;
    const completedCount = completedLessonIds.length;
    const learningScore = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        learningScore,
        weakCategories,
        strongCategories,
        recommendedLessons: recommendedLessons.map(l => ({
          _id: l._id,
          title: l.content?.english?.title || l.title,
          category: l.category,
          icon: l.icon,
          difficulty: l.difficulty,
          xpReward: l.xpReward,
        })),
        recommendedDifficulty,
        accuracy: Math.round(accuracy),
        totalCompleted: completedCount,
        totalLessons,
        xp: user.xp || 0,
        level: user.level || 1,
        nextLevelXp: ((user.level || 1) + 1) * 100,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Tutor - Smart Eco Buddy with contextual responses
 */
exports.getAiTutor = async (req, res) => {
  try {
    const { query } = req.body;
    const users = getCollection('users');
    const user = users.findById(req.user.id);
    const lang = user?.language || 'english';

    if (!query) {
      const greetings = {
        english: "🌿 Hey there! I'm Eco Buddy, your AI learning assistant! Ask me about the environment, lessons, or anything nature-related!",
        tamil: "🌿 வணக்கம்! நான் ஈகோ பட்டி, உங்கள் AI கற்றல் உதவியாளர்! சுற்றுச்சூழல், பாடங்கள் அல்லது இயற்கை தொடர்பான எதையும் என்னிடம் கேளுங்கள்!",
        hindi: "🌿 नमस्ते! मैं इको बडी, आपका AI लर्निंग असिस्टेंट हूँ! पर्यावरण, पाठ या प्रकृति से जुड़ी कोई भी बात पूछें!"
      };
      return res.status(200).json({ success: true, response: greetings[lang] || greetings.english });
    }

    const lowerQuery = query.toLowerCase();
    let response = '';

    // Context-aware responses based on pattern matching
    if (lowerQuery.includes('tree') || lowerQuery.includes('forest') || lowerQuery.includes('plant')) {
      response = {
        english: `🌳 Great question about trees! Trees are amazing - they absorb CO2 and produce oxygen. Did you know the Amazon rainforest produces 20% of Earth's oxygen? Want to learn more about Forests? 🌿`,
        tamil: `🌳 மரங்களைப் பற்றிய சிறந்த கேள்வி! மரங்கள் CO2 ஐ உறிஞ்சி ஆக்ஸிஜனை உற்பத்தி செய்கின்றன. அமேசான் மழைக்காடு பூமியின் 20% ஆக்ஸிஜனை உற்பத்தி செய்கிறது!`,
        hindi: `🌳 पेड़ों के बारे में बढ़िया सवाल! पेड़ CO2 सोखते हैं और ऑक्सीजन पैदा करते हैं। अमेज़न वर्षावन पृथ्वी का 20% ऑक्सीजन पैदा करता है!`
      }[lang] || response;
    } else if (lowerQuery.includes('water') || lowerQuery.includes('ocean') || lowerQuery.includes('sea')) {
      response = {
        english: `💧 Water is precious! Only 1% of Earth's water is drinkable. Did you know the same water has been cycling for billions of years? Let's learn about Water Conservation! 🌊`,
        tamil: `💧 நீர் விலைமதிப்பற்றது! பூமியின் நீரில் 1% மட்டுமே குடிக்கத் தகுந்தது. அதே நீர் பில்லியன் கணக்கான ஆண்டுகளாக சுழற்சியில் உள்ளது!`,
        hindi: `💧 पानी कीमती है! पृथ्वी का केवल 1% पानी पीने योग्य है। वही पानी अरबों वर्षों से चक्रित हो रहा है!`
      }[lang] || response;
    } else if (lowerQuery.includes('recycle') || lowerQuery.includes('plastic') || lowerQuery.includes('waste')) {
      response = {
        english: `♻️ Recycling is super important! A plastic bottle takes 450 years to decompose. Always reduce, reuse, and recycle! Want to become a Recycling Expert? 🌱`,
        tamil: `♻️ மறுசுழற்சி மிகவும் முக்கியம்! ஒரு பிளாஸ்டிக் பாட்டில் 450 ஆண்டுகள் அழிய எடுக்கும். எப்போதும் குறைத்தல், மறுபயன்பாடு மற்றும் மறுசுழற்சி செய்யுங்கள்!`,
        hindi: `♻️ रीसाइक्लिंग बहुत महत्वपूर्ण है! प्लास्टिक की बोतल को नष्ट होने में 450 साल लगते हैं। हमेशा कम करें, पुन: उपयोग करें और रीसाइकिल करें!`
      }[lang] || response;
    } else if (lowerQuery.includes('energy') || lowerQuery.includes('solar') || lowerQuery.includes('electric')) {
      response = {
        english: `☀️ Solar energy is amazing! The sun gives us enough energy in 1 hour to power Earth for a whole year! Want to explore Green Energy World? ⚡`,
        tamil: `☀️ சூரிய ஆற்றல் அற்புதமானது! சூரியன் 1 மணி நேரத்தில் பூமியை ஒரு முழு ஆண்டுக்கு இயக்கும் ஆற்றலைத் தருகிறது!`,
        hindi: `☀️ सौर ऊर्जा अद्भुत है! सूरज 1 घंटे में पृथ्वी को पूरे साल के लिए ऊर्जा देता है!`
      }[lang] || response;
    } else if (lowerQuery.includes('animal') || lowerQuery.includes('bird') || lowerQuery.includes('wildlife')) {
      response = {
        english: `🐯 Animals are incredible! There are over 8 million species on Earth. Want to explore Wildlife World and learn about amazing creatures? 🦁`,
        tamil: `🐯 விலங்குகள் நம்பமுடியாதவை! பூமியில் 8 மில்லியனுக்கும் மேற்பட்ட இனங்கள் உள்ளன.`,
        hindi: `🐯 जानवर अविश्वसनीय हैं! पृथ्वी पर 8 मिलियन से अधिक प्रजातियां हैं।`
      }[lang] || response;
    } else if (lowerQuery.includes('quiz') || lowerQuery.includes('practice') || lowerQuery.includes('test')) {
      const quizzes = getCollection('quizzes');
      const allQuizzes = quizzes.find({ isActive: true });
      const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
      const q = randomQuiz?.question?.english;
      response = {
        english: `📝 Try this question: "${q?.text}" Options: ${q?.options?.join(', ')} 🤔`,
        tamil: `📝 இந்த கேள்வியை முயற்சிக்கவும்: "${randomQuiz?.question?.tamil?.text}"`,
        hindi: `📝 यह सवाल आज़माएं: "${randomQuiz?.question?.hindi?.text}"`
      }[lang] || `📝 Let's practice! Try some lessons first!`;
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      response = {
        english: `👋 Hello ${user?.name || 'Eco Friend'}! Ready to learn about nature today? 🌿 What would you like to explore?`,
        tamil: `👋 வணக்கம் ${user?.name || 'சூழல் நண்பர்'}! இயற்கையைப் பற்றி இன்று கற்க தயாரா?`,
        hindi: `👋 नमस्ते ${user?.name || 'इको दोस्त'}! क्या आप आज प्रकृति के बारे में सीखने के लिए तैयार हैं?`
      }[lang] || response;
    } else {
      response = {
        english: `🌍 That's an interesting question! The environment is full of amazing things to discover. Check out our lessons and games to learn more! 📚🎮`,
        tamil: `🌍 சுவாரஸ்யமான கேள்வி! சுற்றுச்சூழல் கண்டுபிடிக்க அற்புதமான விஷயங்கள் நிறைந்துள்ளது.`,
        hindi: `🌍 यह दिलचस्प सवाल है! पर्यावरण में खोजने के लिए अद्भुत चीजें हैं।`
      }[lang] || response;
    }

    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Smart Revision - Creates revision sessions for weak topics
 */
exports.getRevisionSession = async (req, res) => {
  try {
    const users = getCollection('users');
    const lessons = getCollection('lessons');
    const quizzes = getCollection('quizzes');
    const user = users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const completedIds = (user.completedLessons || []).map(cl => cl.lessonId);
    const allLessons = lessons.find({ isActive: true });

    // Find lessons to revise - ones with low scores or from weak categories
    const weakScores = (user.completedLessons || []).filter(cl => (cl.score || 0) < 70);
    const weakIds = weakScores.map(ws => ws.lessonId);
    const weakLessonDetails = allLessons.filter(l => weakIds.includes(l._id));
    
    // Find uncompleted lessons from same categories
    const revLessonIds = [...new Set([...weakIds, ...allLessons.filter(l => 
      !completedIds.includes(l._id)
    ).map(l => l._id)])];
    
    const revLessons = allLessons.filter(l => revLessonIds.slice(0, 5).includes(l._id));
    const revQuizzes = quizzes.find({ isActive: true }).slice(0, 5);

    res.status(200).json({
      success: true,
      session: {
        lessonsToRevise: revLessons.map(l => ({
          _id: l._id,
          title: l.content?.english?.title || l.title,
          category: l.category,
          icon: l.icon,
          difficulty: l.difficulty,
        })),
        quizQuestions: revQuizzes.map(q => ({
          _id: q._id,
          text: q.question?.english?.text,
          options: q.question?.english?.options,
        })),
        weakTopics: weakLessonDetails.map(l => l.content?.english?.title || l.title),
        totalToReview: revLessons.length,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Carbon Footprint Calculator
 */
exports.calculateCarbonFootprint = async (req, res) => {
  try {
    const { travel, electricity, waterUsage, waste } = req.body;
    
    // Simple carbon calculation
    const travelEmissions = (travel || 0) * 0.12; // kg CO2 per km
    const electricityEmissions = (electricity || 0) * 0.5; // kg CO2 per kWh
    const waterEmissions = (waterUsage || 0) * 0.01; // kg CO2 per liter
    const wasteEmissions = (waste || 0) * 2.5; // kg CO2 per kg
    
    const totalFootprint = travelEmissions + electricityEmissions + waterEmissions + wasteEmissions;
    
    let rating = 'Excellent';
    let color = '#4CAF50';
    let suggestion = 'You are a true Eco Champion! Keep it up! 🌍✨';
    
    if (totalFootprint > 500) {
      rating = 'High';
      color = '#f44336';
      suggestion = 'Try using public transport, reducing electricity, and recycling more! 🌱';
    } else if (totalFootprint > 200) {
      rating = 'Moderate';
      color = '#FF9800';
      suggestion = 'You\'re doing okay but can improve! Switch to LED bulbs and walk when possible! 🌿';
    } else if (totalFootprint > 50) {
      rating = 'Low';
      color = '#8BC34A';
      suggestion = 'Good job! Try solar energy and planting trees to reduce more! 🌳';
    }

    const comparison = {
      averageIndian: 180,
      averageGlobal: 500,
      yourFootprint: Math.round(totalFootprint),
    };

    const tips = [
      'Plant a tree - it absorbs 48 lbs of CO2 per year! 🌳',
      'Use public transport to reduce emissions 🚌',
      'Turn off lights when not in use 💡',
      'Fix leaking taps to save water 💧',
      'Recycle plastic, paper, and glass ♻️',
    ];

    res.status(200).json({
      success: true,
      data: {
        totalFootprint: Math.round(totalFootprint),
        breakdown: {
          travel: Math.round(travelEmissions),
          electricity: Math.round(electricityEmissions),
          water: Math.round(waterEmissions),
          waste: Math.round(wasteEmissions),
        },
        rating,
        color,
        suggestion,
        comparison,
        tips,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Report Card Generator
 */
exports.getReportCard = async (req, res) => {
  try {
    const users = getCollection('users');
    const lessons = getCollection('lessons');
    const games = getCollection('games');
    const user = users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const totalLessons = lessons.find({ isActive: true }).length;
    const completedCount = user.completedLessons?.length || 0;
    const completedPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const avgScore = user.completedLessons?.length > 0
      ? Math.round(user.completedLessons.reduce((s, cl) => s + (cl.score || 0), 0) / user.completedLessons.length)
      : 0;

    const allGames = games.find({ isActive: true }).length;

    const report = {
      studentName: user.name,
      date: new Date().toISOString(),
      level: user.level || 1,
      xp: user.xp || 0,
      coins: user.coins || 0,
      streak: user.streak || 0,
      learningScore: completedPct,
      quizAccuracy: avgScore,
      lessonsCompleted: completedCount,
      totalLessons,
      gamesPlayed: 0,
      totalGames: allGames,
      totalTimeSpent: Math.floor((user.totalTimeSpent || 0) / 60) + 'h ' + ((user.totalTimeSpent || 0) % 60) + 'm',
      completionRate: completedPct + '%',
      badges: user.badges || [],
      achievements: user.achievements || [],
      recommendations: [],
    };

    // Generate recommendations
    if (completedPct < 30) report.recommendations.push('📚 Start with beginner lessons to build your foundation');
    if (completedPct > 80) report.recommendations.push('🏆 Great progress! Try advanced lessons and boss levels');
    if (avgScore < 60) report.recommendations.push('📝 Practice more quizzes to improve your scores');
    if ((user.streak || 0) < 3) report.recommendations.push('🔥 Try to maintain a daily learning streak');
    if ((user.coins || 0) > 200) report.recommendations.push('🛍️ You have coins! Visit the Shop to customize your avatar');

    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate a personalized learning path
 */
exports.getLearningPath = async (req, res) => {
  try {
    const users = getCollection('users');
    const lessons = getCollection('lessons');
    const user = users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const completedIds = new Set((user.completedLessons || []).map(cl => cl.lessonId));
    const notCompleted = lessons.find({ isActive: true }).filter(l => !completedIds.has(l._id));

    // Build a structured learning path by category and difficulty
    const path = {};
    notCompleted.forEach(l => {
      if (!path[l.category]) path[l.category] = [];
      path[l.category].push(l);
    });

    const learningPath = Object.entries(path).map(([category, lessons]) => ({
      category,
      icon: lessons[0]?.icon || '📚',
      totalLessons: lessons.length,
      difficulty: lessons[0]?.difficulty || 'beginner',
      lessons: lessons.slice(0, 5).map(l => ({
        _id: l._id,
        title: l.content?.english?.title || l.title,
        difficulty: l.difficulty,
        xpReward: l.xpReward,
      })),
    }));

    res.status(200).json({ success: true, path: learningPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};