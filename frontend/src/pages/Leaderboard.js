import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { leaderboardAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardAPI.get({ period })
      .then(res => setLeaderboard(res.data.leaderboard))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="leaderboard-page">
      <h1 style={{ marginBottom: 10 }}>🏆 Leaderboard</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>See how you rank against other eco-learners!</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <button className={`btn ${period === 'all' ? 'btn-primary' : ''}`} onClick={() => setPeriod('all')}>All Time</button>
        <button className={`btn ${period === 'weekly' ? 'btn-primary' : ''}`} onClick={() => setPeriod('weekly')}>Weekly</button>
        <button className={`btn ${period === 'monthly' ? 'btn-primary' : ''}`} onClick={() => setPeriod('monthly')}>Monthly</button>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Level</th>
            <th>XP</th>
            <th>Coins</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, i) => (
            <motion.tr
              key={entry._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{ background: entry._id === user?.id ? 'rgba(76,175,80,0.1)' : 'transparent' }}
            >
              <td>
                <div className={`rank-badge ${entry.rank === 1 ? 'rank-1' : entry.rank === 2 ? 'rank-2' : entry.rank === 3 ? 'rank-3' : ''}`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="user-avatar" style={{ width: 30, height: 30, fontSize: 14 }}>{entry.name?.[0]}</div>
                  <strong>{entry.name}</strong>
                  {entry._id === user?.id && <span className="badge badge-green">You</span>}
                </div>
              </td>
              <td>Lv.{entry.level}</td>
              <td>⭐ {entry.xp}</td>
              <td>🪙 {entry.coins}</td>
              <td>🔥 {entry.streak || 0} days</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;