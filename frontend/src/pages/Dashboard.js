import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { progressAPI, lessonAPI, challengeAPI, leaderboardAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Confetti from 'react-confetti';

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [rankInfo, setRankInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, catRes, chalRes, rankRes] = await Promise.all([
          progressAPI.get(),
          lessonAPI.getCategories(),
          challengeAPI.getToday().catch(() => null),
          leaderboardAPI.getMyPosition().catch(() => null),
        ]);
        setProgress(progRes.data.progress);
        setCategories(catRes.data.categories);
        setDailyChallenge(chalRes?.data?.challenge);
        setRankInfo(rankRes?.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
      
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user?.name}! 🌟</h1>
          <p>Ready to save the planet today? Let's go! 🌍</p>
        </div>
        <Link to="/lessons" className="btn btn-primary btn-lg pulse-anim">📚 Continue Learning</Link>
      </div>

      <div className="stats-grid">
        <motion.div className="card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{progress?.level || user?.level}</div>
          <div className="stat-label">Level</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${((progress?.xp || 0) / (progress?.xpForNextLevel || 100)) * 100}%` }} />
          </div>
          <small style={{ color: '#666' }}>{progress?.xp || 0}/{progress?.xpForNextLevel || 100} XP</small>
        </motion.div>
        <motion.div className="card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon">🪙</div>
          <div className="stat-value">{user?.coins || 0}</div>
          <div className="stat-label">Coins</div>
        </motion.div>
        <motion.div className="card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{progress?.streak || user?.streak || 0}</div>
          <div className="stat-label">Day Streak</div>
        </motion.div>
        <motion.div className="card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="stat-icon">🏆</div>
          <div className="stat-value">#{rankInfo?.rank || '?'}</div>
          <div className="stat-label">Leaderboard</div>
        </motion.div>
        <motion.div className="card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="stat-icon">📚</div>
          <div className="stat-value">{progress?.completedLessons || 0}/{progress?.totalLessons || 0}</div>
          <div className="stat-label">Lessons Done</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${progress?.completionPercentage || 0}%` }} />
          </div>
        </motion.div>
        <motion.div className="card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{Math.floor((progress?.totalTimeSpent || 0) / 60)}h {progress?.totalTimeSpent || 0 % 60}m</div>
          <div className="stat-label">Time Spent</div>
        </motion.div>
      </div>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <motion.div className="card" style={{ marginBottom: 40, background: 'linear-gradient(135deg, #fff8e1, #fff3e0)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h3>🎯 Daily Challenge</h3>
              <p>{dailyChallenge.localizedTitle}</p>
              <p style={{ color: '#666' }}>{dailyChallenge.localizedDescription}</p>
              <p>Rewards: ⭐ {dailyChallenge.xpReward} XP + 🪙 {dailyChallenge.coinReward} Coins</p>
            </div>
            <button className="btn btn-secondary" onClick={async () => {
              try {
                await challengeAPI.complete({ challengeId: dailyChallenge._id });
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              } catch (err) { console.error(err); }
            }}>🎯 Complete Challenge</button>
          </div>
        </motion.div>
      )}

      {/* Categories */}
      <h2 style={{ marginBottom: 20 }}>📚 Learning Categories</h2>
      <div className="categories-grid">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            className="card category-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => window.location.href = '/lessons?category=' + cat.id}
          >
            <span className="category-icon">{cat.icon}</span>
            <h3 className="category-title">{cat.name}</h3>
            <span className="badge badge-green">{cat.lessonCount} lessons</span>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      {progress?.badges?.length > 0 && (
        <>
          <h2 style={{ marginBottom: 20 }}>🏅 Your Badges</h2>
          <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', marginBottom: 40 }}>
            {progress.badges.map((badge, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: 15, minWidth: 120 }}>
                <div style={{ fontSize: 36 }}>{badge.name?.includes('Gold') ? '🥇' : badge.name?.includes('Silver') ? '🥈' : badge.name?.includes('Diamond') ? '💎' : '🌟'}</div>
                <small>{badge.name}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;