const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Game = require('../models/Game');
const Achievement = require('../models/Achievement');

dotenv.config({ path: '../.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Game.deleteMany({});
    await Achievement.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@ecolearn.com',
      password: 'admin123',
      age: 25,
      role: 'admin',
      xp: 1000,
      coins: 500,
      level: 5,
    });
    console.log('Admin user created');

    // Create sample child user
    const child = await User.create({
      name: 'Eco Kid',
      email: 'kid@ecolearn.com',
      password: 'kid123',
      age: 8,
      role: 'child',
      xp: 250,
      coins: 120,
      level: 2,
      streak: 3,
    });
    console.log('Sample child user created');

    // Create lessons
    const lessons = await Lesson.insertMany([
      {
        title: 'Amazing Trees',
        category: 'trees',
        icon: '🌳',
        difficulty: 'beginner',
        order: 1,
        content: {
          english: {
            title: 'Amazing Trees',
            description: 'Learn about trees and why they are important for our planet',
            explanation: 'Trees are the largest plants on Earth. They give us oxygen, food, and shade. Trees are home to many birds and animals. They help keep our air clean and our planet cool.',
            vocabulary: [
              { word: 'Tree', meaning: 'A tall plant with a trunk and branches', translation: 'மரம்' },
              { word: 'Oxygen', meaning: 'The gas we breathe', translation: 'ஆக்ஸிஜன்' },
              { word: 'Leaves', meaning: 'Parts of a tree that make food', translation: 'இலைகள்' },
              { word: 'Roots', meaning: 'Parts of a tree under the ground', translation: 'வேர்கள்' },
            ],
            miniStory: {
              title: 'The Little Seed',
              content: 'Once upon a time, a tiny seed fell on the ground. It was scared because everything was so big. But the sun smiled at it, the rain watered it, and the soil hugged it. Slowly, the seed grew into a big, strong tree. Birds made nests in its branches, children played in its shade, and the tree was happy because it could help everyone.',
              moral: 'Even the smallest things can grow into something wonderful with care and love.',
            },
            funFacts: [
              'Trees can live for thousands of years!',
              'One tree can produce enough oxygen for 4 people to breathe',
              'Trees communicate with each other through underground networks',
            ],
          },
          tamil: {
            title: 'அற்புதமான மரங்கள்',
            description: 'மரங்களைப் பற்றியும், அவை நமது கிரகத்திற்கு ஏன் முக்கியம் என்பதையும் கற்றுக்கொள்ளுங்கள்',
            explanation: 'மரங்கள் பூமியில் மிகப்பெரிய தாவரங்கள். அவை நமக்கு ஆக்ஸிஜன், உணவு மற்றும் நிழலைத் தருகின்றன. மரங்கள் பல பறவைகள் மற்றும் விலங்குகளின் வீடாகும். அவை நமது காற்றை சுத்தமாகவும், நமது கிரகத்தை குளிர்ச்சியாகவும் வைத்திருக்க உதவுகின்றன.',
            vocabulary: [
              { word: 'மரம்', meaning: 'தண்டு மற்றும் கிளைகளைக் கொண்ட உயரமான தாவரம்', translation: 'Tree' },
              { word: 'ஆக்ஸிஜன்', meaning: 'நாம் சுவாசிக்கும் வாயு', translation: 'Oxygen' },
              { word: 'இலைகள்', meaning: 'உணவு தயாரிக்கும் மரத்தின் பகுதிகள்', translation: 'Leaves' },
            ],
            miniStory: {
              title: 'சிறிய விதை',
              content: 'ஒரு காலத்தில், ஒரு சிறிய விதை தரையில் விழுந்தது. எல்லாம் மிகவும் பெரியதாக இருந்ததால் அது பயந்தது. ஆனால் சூரியன் அதைப் பார்த்து சிரித்தது, மழை அதற்கு தண்ணீர் ஊற்றியது, மண் அதை அரவணைத்தது. மெதுவாக, விதை ஒரு பெரிய, வலுவான மரமாக வளர்ந்தது.',
              moral: 'அன்பும் கவனிப்பும் இருந்தால் மிகச் சிறிய விஷயங்கள் கூட அற்புதமாக வளர முடியும்.',
            },
            funFacts: [
              'மரங்கள் ஆயிரக்கணக்கான ஆண்டுகள் வாழ முடியும்!',
              'ஒரு மரம் 4 நபர்கள் சுவாசிக்க போதுமான ஆக்ஸிஜனை உற்பத்தி செய்ய முடியும்',
            ],
          },
          hindi: {
            title: 'अद्भुत पेड़',
            description: 'पेड़ों के बारे में जानें और वे हमारे ग्रह के लिए क्यों महत्वपूर्ण हैं',
            explanation: 'पेड़ पृथ्वी पर सबसे बड़े पौधे हैं। वे हमें ऑक्सीजन, भोजन और छाया देते हैं। पेड़ कई पक्षियों और जानवरों का घर हैं। वे हमारी हवा को साफ और हमारे ग्रह को ठंडा रखने में मदद करते हैं।',
            vocabulary: [
              { word: 'पेड़', meaning: 'तने और शाखाओं वाला एक लंबा पौधा', translation: 'Tree' },
              { word: 'ऑक्सीजन', meaning: 'वह गैस जो हम सांस लेते हैं', translation: 'Oxygen' },
            ],
            miniStory: {
              title: 'छोटा बीज',
              content: 'एक समय की बात है, एक छोटा बीज जमीन पर गिरा। वह डर गया क्योंकि सब कुछ बहुत बड़ा था। लेकिन सूरज ने उसे देखकर मुस्कुराया, बारिश ने उसे पानी दिया, और मिट्टी ने उसे गले लगाया। धीरे-धीरे, बीज एक बड़े, मजबूत पेड़ में बदल गया।',
              moral: 'देखभाल और प्यार से छोटी से छोटी चीज़ भी अद्भुत बन सकती है।',
            },
            funFacts: [
              'पेड़ हजारों साल तक जीवित रह सकते हैं!',
              'एक पेड़ 4 लोगों के सांस लेने के लिए पर्याप्त ऑक्सीजन पैदा कर सकता है',
            ],
          },
        },
        images: [{ url: '/images/trees.jpg', alt: 'Beautiful forest with tall trees', caption: 'A forest full of trees' }],
        xpReward: 20,
        coinReward: 10,
      },
      {
        title: 'Water is Life',
        category: 'water',
        icon: '💧',
        difficulty: 'beginner',
        order: 2,
        content: {
          english: {
            title: 'Water is Life',
            description: 'Discover the importance of water for all living things',
            explanation: 'Water covers about 71% of Earth\'s surface. All living things need water to survive. We use water for drinking, washing, growing food, and making energy. Saving water helps our planet stay healthy.',
            vocabulary: [
              { word: 'Water', meaning: 'A clear liquid that all living things need', translation: 'தண்ணீர்' },
              { word: 'Ocean', meaning: 'A large body of salt water', translation: 'கடல்' },
              { word: 'River', meaning: 'A flowing body of fresh water', translation: 'ஆறு' },
            ],
            miniStory: {
              title: 'The Water Drop Adventure',
              content: 'A little water drop named Dew lived in a cloud. One day, Dew fell down as rain into a river. The river took Dew to the ocean. The sun warmed Dew and turned it into vapor, floating back up to the cloud. Dew learned that water goes on a never-ending journey called the water cycle!',
              moral: 'Water is precious and never wasted - it keeps cycling to help all life.',
            },
            funFacts: [
              'Only 1% of Earth\'s water is drinkable',
              'A person can survive only 3 days without water',
              'Water can be solid (ice), liquid, or gas (vapor)',
            ],
          },
          tamil: {
            title: 'நீரே வாழ்க்கை',
            description: 'அனைத்து உயிரினங்களுக்கும் நீரின் முக்கியத்துவத்தைக் கண்டறியுங்கள்',
            explanation: 'நீர் பூமியின் மேற்பரப்பில் 71% மூடியுள்ளது. அனைத்து உயிரினங்களும் வாழ தண்ணீர் தேவை. குடிப்பதற்கும், கழுவுவதற்கும், உணவு வளர்ப்பதற்கும், ஆற்றல் உற்பத்தி செய்வதற்கும் நாம் தண்ணீரைப் பயன்படுத்துகிறோம்.',
            vocabulary: [
              { word: 'தண்ணீர்', meaning: 'அனைத்து உயிரினங்களுக்கும் தேவையான தெளிவான திரவம்', translation: 'Water' },
            ],
            miniStory: {
              title: 'நீர்த்துளியின் சாகசம்',
              content: 'டியூ என்ற சிறிய நீர்த்துளி ஒரு மேகத்தில் வாழ்ந்தது. ஒரு நாள், டியூ மழையாக ஆற்றில் விழுந்தது. ஆறு டியூவை கடலுக்கு அழைத்துச் சென்றது.',
              moral: 'நீர் விலைமதிப்பற்றது மற்றும் ஒருபோதும் வீணாகாது - அது அனைத்து உயிர்களுக்கும் உதவ தொடர்ந்து சுழற்சி செய்கிறது.',
            },
            funFacts: [
              'பூமியின் நீரில் 1% மட்டுமே குடிக்கத் தகுந்தது',
            ],
          },
          hindi: {
            title: 'पानी ही जीवन है',
            description: 'सभी जीवित चीजों के लिए पानी के महत्व की खोज करें',
            explanation: 'पानी पृथ्वी की सतह का लगभग 71% भाग कवर करता है। सभी जीवित चीजों को जीवित रहने के लिए पानी की आवश्यकता होती है।',
            vocabulary: [
              { word: 'पानी', meaning: 'एक साफ तरल जो सभी जीवित चीजों को चाहिए', translation: 'Water' },
            ],
            miniStory: {
              title: 'पानी की बूंद का साहसिक कार्य',
              content: 'ड्यू नाम की एक छोटी पानी की बूंद बादल में रहती थी। एक दिन, ड्यू बारिश के रूप में नदी में गिर गई।',
              moral: 'पानी कीमती है और कभी बर्बाद नहीं होता - यह सभी जीवन की मदद करने के लिए चक्रित होता रहता है।',
            },
            funFacts: [
              'पृथ्वी के केवल 1% पानी ही पीने योग्य है',
            ],
          },
        },
        images: [{ url: '/images/water.jpg', alt: 'Clean water in a river', caption: 'Fresh water flowing' }],
        xpReward: 20,
        coinReward: 10,
      },
    ]);
    console.log(`${lessons.length} lessons created`);

    // Create quizzes
    const quizzes = await Quiz.insertMany([
      {
        lessonId: lessons[0]._id,
        question: {
          english: { text: 'What do trees give us to breathe?', options: ['Water', 'Oxygen', 'Food', 'Light'], correctAnswer: 1, explanation: 'Trees produce oxygen through photosynthesis!' },
          tamil: { text: 'மரங்கள் நமக்கு சுவாசிக்க எதைத் தருகின்றன?', options: ['தண்ணீர்', 'ஆக்ஸிஜன்', 'உணவு', 'ஒளி'], correctAnswer: 1, explanation: 'மரங்கள் ஒளிச்சேர்க்கை மூலம் ஆக்ஸிஜனை உற்பத்தி செய்கின்றன!' },
          hindi: { text: 'पेड़ हमें सांस लेने के लिए क्या देते हैं?', options: ['पानी', 'ऑक्सीजन', 'भोजन', 'रोशनी'], correctAnswer: 1, explanation: 'पेड़ प्रकाश संश्लेषण के माध्यम से ऑक्सीजन का उत्पादन करते हैं!' },
        },
        questionType: 'multiple-choice',
        difficulty: 'easy',
        xpReward: 10,
      },
      {
        lessonId: lessons[0]._id,
        question: {
          english: { text: 'Trees produce oxygen. Is this true?', options: ['True', 'False'], correctAnswer: 0, explanation: 'Yes! Trees take in CO2 and release oxygen.' },
          tamil: { text: 'மரங்கள் ஆக்ஸிஜனை உற்பத்தி செய்கின்றன. இது உண்மையா?', options: ['உண்மை', 'தவறு'], correctAnswer: 0, explanation: 'ஆம்! மரங்கள் CO2 ஐ எடுத்து ஆக்ஸிஜனை வெளியிடுகின்றன.' },
          hindi: { text: 'पेड़ ऑक्सीजन का उत्पादन करते हैं। क्या यह सच है?', options: ['सच', 'झूठ'], correctAnswer: 0, explanation: 'हाँ! पेड़ CO2 लेते हैं और ऑक्सीजन छोड़ते हैं।' },
        },
        questionType: 'true-false',
        difficulty: 'easy',
        xpReward: 10,
      },
    ]);
    console.log(`${quizzes.length} quizzes created`);

    // Create achievements
    const achievements = await Achievement.insertMany([
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🌟',
        type: 'lessons',
        requirement: 1,
        rewardXp: 50,
        rewardCoins: 25,
        badgeName: 'Beginner Badge',
        language: {
          english: { name: 'First Steps', description: 'Complete your first lesson' },
          tamil: { name: 'முதல் படிகள்', description: 'உங்கள் முதல் பாடத்தை முடிக்கவும்' },
          hindi: { name: 'पहला कदम', description: 'अपना पहला पाठ पूरा करें' },
        },
      },
      {
        name: '5-Day Streak',
        description: 'Log in for 5 days in a row',
        icon: '🔥',
        type: 'streak',
        requirement: 5,
        rewardXp: 100,
        rewardCoins: 50,
        badgeName: 'Silver Badge',
        language: {
          english: { name: '5-Day Streak', description: 'Log in for 5 days in a row' },
          tamil: { name: '5-நாள் தொடர்', description: '5 நாட்கள் தொடர்ச்சியாக உள்நுழையவும்' },
          hindi: { name: '5-दिन का सिलसिला', description: 'लगातार 5 दिन लॉग इन करें' },
        },
      },
      {
        name: 'Eco Champion',
        description: 'Complete all lessons in a category',
        icon: '🏆',
        type: 'lessons',
        requirement: 5,
        rewardXp: 200,
        rewardCoins: 100,
        badgeName: 'Gold Badge',
        language: {
          english: { name: 'Eco Champion', description: 'Complete all lessons in a category' },
          tamil: { name: 'சூழல் சாம்பியன்', description: 'ஒரு பிரிவில் அனைத்து பாடங்களையும் முடிக்கவும்' },
          hindi: { name: 'इको चैंपियन', description: 'एक श्रेणी में सभी पाठ पूरा करें' },
        },
      },
    ]);
    console.log(`${achievements.length} achievements created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();