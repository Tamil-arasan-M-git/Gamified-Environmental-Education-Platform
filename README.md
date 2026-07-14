# 🌿 EcoLearn - Gamified Environmental Education Platform

<p align="center">
  <img src="https://img.shields.io/badge/version-3.0.0-green" alt="Version 3.0.0"/>
  <img src="https://img.shields.io/badge/React-18.2-blue" alt="React 18"/>
  <img src="https://img.shields.io/badge/Node.js-24-green" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-ready-brightgreen" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/license-MIT-orange" alt="MIT License"/>
</p>

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Demo Accounts](#-demo-accounts)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

## 🌍 Overview

EcoLearn is a comprehensive gamified educational platform designed for children aged 5-14 to learn environmental awareness through interactive lessons, educational games, and AI-powered features.

The platform supports **English, Tamil, and Hindi** languages and includes **60+ lessons**, **15 educational games**, **922+ questions**, **AI Tutor**, **Adaptive Learning**, and **Parent/Teacher dashboards**.

### 🎯 Problem Statement

Traditional environmental education often fails to engage young learners. Children find textbooks boring and quickly lose interest. EcoLearn solves this by turning environmental education into an engaging game-like experience with rewards, achievements, and interactive content.

### 🎯 Objectives
- Make environmental learning fun and engaging
- Support multiple languages (English, Tamil, Hindi)
- Provide AI-powered personalized learning
- Track progress with gamification (XP, coins, levels)
- Enable parent and teacher involvement
- Build environmental awareness in children

## ✨ Features

### 👨‍🎓 For Students
| Feature | Description |
|---------|-------------|
| 🎮 15 Educational Games | Image Quiz, Memory Match, Word Puzzle, Hangman, Eco Runner, and more |
| 📚 60+ Lessons | Trees, Water, Energy, Animals, Recycling, and more categories |
| 📝 922+ Questions | Multiple choice, true/false, fill-in-blank across 26 categories |
| 🌍 World Map | 7 themed worlds with progressive unlocking |
| 🌱 Virtual Garden | Grow plants by completing lessons |
| 🏆 Leaderboard | Compete with other students |
| ⭐ XP & Levels | 50 levels to achieve |
| 🪙 Coin System | Earn coins through lessons and games |
| 🏅 Achievements | 100+ achievements to unlock |
| 🛍️ Shop | Buy avatar items, themes, and badges |
| 🤖 AI Eco Buddy | Smart chatbot tutor |
| 🌙 Dark/Light Mode | Theme customization |
| 🌐 Multi-language | English, Tamil, Hindi |

### 👩‍🏫 For Teachers
| Feature | Description |
|---------|-------------|
| 📊 Class Management | Create and manage classes |
| 👥 Student Tracking | View progress, XP, coins, lessons |
| 📝 Assignment Tools | Assign lessons and homework |
| 📈 Performance Analytics | Track student performance |

### 👪 For Parents
| Feature | Description |
|---------|-------------|
| 📊 Progress Dashboard | Track child's learning |
| 📚 Completed Lessons | View lesson history |
| 🎯 Quiz Scores | Monitor accuracy |
| ⏱️ Learning Time | Track time spent learning |

### 👑 For Admins
| Feature | Description |
|---------|-------------|
| 📊 Platform Analytics | Total users, lessons, XP |
| 👥 User Management | Add/remove users, change roles |
| 📈 System Statistics | View platform growth |

### 🤖 AI Features
| Feature | Description |
|---------|-------------|
| 🧠 Adaptive Learning | Analyzes weak/strong categories |
| 🤖 AI Tutor | Context-aware chatbot with multi-language support |
| 📝 Smart Revision | Creates revision sessions for weak topics |
| 🌍 Carbon Calculator | Calculate environmental footprint |
| 📋 Report Card Generator | AI-generated performance reports |
| 🗺️ Learning Path | Personalized learning recommendations |

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2.0 | UI Framework |
| React Router | 6.21 | Routing |
| Axios | 1.6 | HTTP Client |
| Framer Motion | 10.16 | Animations |
| React Confetti | 6.1 | Celebrations |
| CSS3 | - | Styling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 24.13 | Runtime |
| Express.js | 4.18 | Web Framework |
| MongoDB | 6+ | Database |
| Mongoose | 8.0 | ODM |
| JWT | 9.0 | Authentication |
| bcryptjs | 2.4 | Password Hashing |
| dotenv | 16.3 | Environment Variables |
| cors | 2.8 | Cross-Origin Resource Sharing |

## 🏛️ Architecture

### MVC Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │  Pages  │  │Componen │  │Context  │  │  Utils  │       │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
│       └─────────────┴─────────────┴─────────────┘          │
│                        │ Axios HTTP                          │
└────────────────────────┼────────────────────────────────────┘
                         │ REST API
┌────────────────────────┼────────────────────────────────────┐
│              Backend (Express.js)                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ Routes  │──│Controller│──│  Models │──►  MongoDB         │
│  └─────────┘  └─────────┘  └─────────┘                     │
│       │          │          │                               │
│  ┌────┴────┐ ┌──┴───┐  ┌───┴────┐                          │
│  │ Middle  │ │Utils │  │ Seeds  │                          │
│  │ -ware   │ │      │  │        │                          │
│  └─────────┘ └──────┘  └────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** v6 or higher (optional - file-based fallback included)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd gamified-environmental-education
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

## ⚙️ Configuration

### Backend Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamified-education
JWT_SECRET=your_super_secret_jwt_key_2024
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### Frontend Configuration
The frontend connects to the backend API via `frontend/src/utils/api.js`. Update if needed:
```javascript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
Expected output:
```
Server running on port 5000
✅ 922 questions generated
✅ 60 lessons generated
✅ Demo data seeded successfully!
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npx react-scripts start
```
Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

### Production Build
```bash
cd frontend
npm run build
npx serve -s build
```

### Using the Batch File
Simply double-click `start_app.bat` to start both servers automatically.

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/updatedetails` | ✅ | Update profile |
| PUT | `/api/auth/updatepassword` | ✅ | Change password |

### Lesson Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/lessons` | ✅ | Get all lessons |
| GET | `/api/lessons/:id` | ✅ | Get single lesson |
| GET | `/api/lessons/categories` | ✅ | Get categories |
| POST | `/api/lessons` | ✅ Admin | Create lesson |
| PUT | `/api/lessons/:id` | ✅ Admin | Update lesson |

### Quiz Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/quizzes` | ✅ | Get quizzes |
| POST | `/api/quizzes/submit` | ✅ | Submit answer |

### Game Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/games` | ✅ | Get all games |
| GET | `/api/games/:id` | ✅ | Get single game |
| POST | `/api/games/complete` | ✅ | Complete a game |

### Question Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/questions` | ✅ | Filtered questions |
| GET | `/api/questions/random` | ✅ | Random questions |
| GET | `/api/questions/category/:cat` | ✅ | By category |
| GET | `/api/questions/game/:type` | ✅ | For specific game |

### Leaderboard Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/leaderboard` | ✅ | Get rankings |
| GET | `/api/leaderboard/me` | ✅ | My position |

### Progress Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/progress` | ✅ | User progress |
| POST | `/api/progress/complete-lesson` | ✅ | Complete lesson |

### AI Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ai/adaptive-learning` | ✅ | Learning analysis |
| POST | `/api/ai/tutor` | ✅ | AI Tutor chat |
| GET | `/api/ai/revision` | ✅ | Revision session |
| POST | `/api/ai/carbon-footprint` | ✅ | Carbon calculator |
| GET | `/api/ai/report-card` | ✅ | Performance report |
| GET | `/api/ai/learning-path` | ✅ | Learning path |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | ✅ Admin | Platform stats |
| GET | `/api/admin/users` | ✅ Admin | All users |
| DELETE | `/api/admin/users/:id` | ✅ Admin | Delete user |

### World & Garden

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/worlds` | ✅ | Get worlds |
| GET | `/api/garden` | ✅ | Get garden |
| POST | `/api/garden/plant` | ✅ | Plant item |
| POST | `/api/garden/water` | ✅ | Water garden |

### Daily Challenge

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/daily-challenge` | ✅ | Today's challenge |
| POST | `/api/daily-challenge/complete` | ✅ | Complete challenge |

## 📁 Project Structure

```
gamified-environmental-education/
├── README.md                    # Project documentation
├── start_app.bat                # One-click start script
│
├── backend/                     # Node.js + Express API
│   ├── server.js                # Server entry point
│   ├── .env                     # Environment variables
│   ├── package.json             # Dependencies
│   │
│   ├── config/
│   │   └── db.js                # Database connection (MongoDB/file fallback)
│   │
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Registration, login, JWT
│   │   ├── lessonController.js  # Lessons CRUD
│   │   ├── quizController.js    # Quiz management
│   │   ├── gameController.js    # Game management
│   │   ├── leaderboardController.js # Rankings
│   │   ├── progressController.js    # User progress
│   │   ├── adminController.js   # Admin panel
│   │   ├── dailyChallengeController.js
│   │   ├── worldController.js   # World map
│   │   ├── gardenController.js  # Virtual garden
│   │   └── aiController.js      # AI features
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Global error handling
│   │
│   ├── models/                  # MongoDB schemas
│   │   ├── User.js              # User with gamification
│   │   ├── Lesson.js            # Multi-language lessons
│   │   ├── Quiz.js              # Quiz questions
│   │   ├── Game.js              # Game definitions
│   │   ├── Leaderboard.js       # Ranking stats
│   │   ├── Achievement.js       # Achievements
│   │   ├── DailyChallenge.js    # Daily tasks
│   │   ├── World.js             # World map
│   │   ├── Garden.js            # Virtual garden
│   │   └── Questions.js         # Question bank
│   │
│   ├── routes/                  # Express routes
│   │   ├── auth.js
│   │   ├── lessons.js
│   │   ├── quizzes.js
│   │   ├── games.js
│   │   ├── leaderboard.js
│   │   ├── progress.js
│   │   ├── admin.js
│   │   ├── dailyChallenge.js
│   │   ├── worlds.js
│   │   ├── garden.js
│   │   ├── ai.js
│   │   └── questions.js
│   │
│   ├── seeds/                   # Database seeders
│   │   ├── seed.js              # Main seed
│   │   ├── lessons-seed.js      # Lesson data
│   │   ├── games-seed.js        # Game data
│   │   ├── categories.seed.js   # Categories
│   │   └── questionGenerator.js # Programmatic question generator
│   │
│   └── utils/
│       └── mockDb.js            # File-based DB fallback
│
└── frontend/                    # React.js app
    ├── package.json
    ├── public/
    │   └── index.html           # HTML template
    │
    └── src/
        ├── index.js             # Entry point
        ├── App.js               # Routes & navigation
        │
        ├── context/
        │   └── AuthContext.js   # Auth state management
        │
        ├── utils/
        │   └── api.js           # Axios API client
        │
        ├── styles/
        │   └── main.css         # Global styles (800+ lines)
        │
        ├── components/          # Reusable components
        │   ├── Navbar.js        # Top navigation bar
        │   ├── EcoBuddyChatbot.js # AI chatbot widget
        │   └── LoadingSpinner.js  # Loading indicator
        │
        └── pages/               # Route pages
            ├── Home.js          # Landing page
            ├── Login.js         # Login form
            ├── Register.js      # Registration form
            ├── Dashboard.js     # User dashboard
            ├── Lessons.js       # Lesson listing
            ├── LessonDetail.js  # Individual lesson
            ├── Games.js         # Game listing
            ├── GamePlay.js      # Game engine
            ├── Leaderboard.js   # Rankings table
            ├── Profile.js       # User settings
            ├── ParentDashboard.js # Parent view
            ├── TeacherDashboard.js # Teacher panel
            └── AdminDashboard.js   # Admin panel
```

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,        // unique
  password: String,     // hashed with bcrypt
  age: Number,
  role: String,          // 'child' | 'parent' | 'teacher' | 'admin'
  level: Number,         // 1-50
  xp: Number,
  coins: Number,
  stars: Number,
  streak: Number,
  language: String,      // 'english' | 'tamil' | 'hindi'
  theme: String,         // 'light' | 'dark'
  avatar: String,
  completedLessons: [{ lessonId, score, completedAt }],
  badges: [{ name, earnedAt }],
  achievements: [String],
  totalTimeSpent: Number,
  lastLoginDate: Date,
  createdAt: Date
}
```

### Lessons Collection
```javascript
{
  _id: ObjectId,
  title: String,
  category: String,      // 'trees' | 'water' | 'earth' | ...
  icon: String,
  difficulty: String,    // 'beginner' | 'intermediate' | 'advanced'
  order: Number,
  xpReward: Number,
  coinReward: Number,
  readingTime: String,
  ageGroup: String,
  content: {
    english: { title, description, explanation, vocabulary, miniStory, funFacts },
    tamil: { ... },
    hindi: { ... }
  },
  isActive: Boolean,
  createdAt: Date
}
```

### Questions Collection
```javascript
{
  _id: ObjectId,
  question: String,
  type: String,           // 'multiple-choice' | 'true-false' | 'fill-blank' | ...
  difficulty: String,     // 'easy' | 'medium' | 'hard'
  category: String,
  answer: Mixed,
  options: [String],
  correctAnswer: Number,
  explanation: String,
  timesAnswered: Number,
  timesCorrect: Number,
  isActive: Boolean,
  createdAt: Date
}
```

### Games Collection
```javascript
{
  _id: ObjectId,
  title: { english, tamil, hindi },
  gameType: String,       // 'image-quiz' | 'memory-card' | 'drag-drop' | ...
  category: String,
  difficulty: String,
  xpReward: Number,
  coinReward: Number,
  instructions: { english, tamil, hindi },
  content: { english: { questions, cards, dragItems, ... }, tamil, hindi }
}
```

### Game Progress
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  gameId: ObjectId,
  score: Number,
  stars: Number,
  difficulty: String,
  completedAt: Date
}
```

## 👤 Demo Accounts

| Role | Email | Password | Features |
|------|-------|----------|----------|
| 👑 **Admin** | admin@ecolearn.com | admin123 | Full access, user management |
| 👶 **Child** | kid@ecolearn.com | kid123 | Lessons, games, leaderboard |

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration works
- [ ] Login/logout works
- [ ] Dashboard displays correctly
- [ ] Lessons load and display content
- [ ] Quizzes function properly
- [ ] All 15 games work without errors
- [ ] Leaderboard shows rankings
- [ ] Profile editing works
- [ ] Theme switching works
- [ ] AI chatbot responds to queries
- [ ] Parent dashboard shows data
- [ ] Teacher dashboard functions
- [ ] Admin panel works
- [ ] Responsive on mobile/tablet

### Test Commands
```bash
# Backend health check
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kid@ecolearn.com","password":"kid123"}'
```

## ☁️ Deployment

### Frontend - Vercel
```bash
cd frontend
npm run build
npx vercel --prod
```

### Backend - Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables

### Database - MongoDB Atlas
1. Create free cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in environment variables

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecolearn
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend.vercel.app
```

## 📸 Screenshots

*(Screenshots would be included here in production)*

| Page | Description |
|------|-------------|
| Home | Animated landing page with floating trees, clouds, birds |
| Dashboard | Stats, progress bars, daily challenge, categories |
| Lessons | Category grid, lesson cards with XP rewards |
| Lesson Detail | Full lesson content with vocabulary, story, quiz |
| Games | 15 game types with difficulty selection |
| Game Play | Interactive timer, lives, combo system |
| Leaderboard | Ranked table with gold/silver/bronze badges |
| Profile | Settings, password change, theme toggle |
| Admin | Platform stats, user management |
| Teacher | Classes, students, assignment tools |
| Eco Buddy | AI chatbot widget |

## 🚀 Future Enhancements

- [ ] **Voice Learning** - Text-to-speech for lessons and quizzes
- [ ] **Image Recognition** - TensorFlow.js for plant/animal identification
- [ ] **Mobile App** - React Native conversion
- [ ] **Live Classroom** - Real-time video lessons
- [ ] **Community Challenges** - Group environmental activities
- [ ] **Offline Mode** - PWA with offline support
- [ ] **Achievement Animations** - Celebrations on level up
- [ ] **Email Reports** - Weekly parent reports via email
- [ ] **Tournament System** - Weekly quizzes with rankings
- [ ] **Multiplayer Quiz** - Real-time competition

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- **React**: Functional components with hooks
- **Express**: MVC pattern
- **Naming**: camelCase for variables, PascalCase for components
- **Formatting**: Consistent indentation, meaningful comments

## 📄 License

This project is licensed under the **MIT License** - see below.

```
MIT License

Copyright (c) 2026 EcoLearn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

## 👨‍💻 Authors

- **EcoLearn Team** - *Initial work* - Environmental Education Platform

## 🙏 Acknowledgments

- Inspired by Duolingo, Khan Academy Kids, and ABCmouse
- Environmental content based on UN Sustainable Development Goals
- Multi-language support for inclusive education
- Built with React, Node.js, MongoDB, and Express

---

<p align="center">
  Made with ❤️ for the future of our planet 🌍
</p>