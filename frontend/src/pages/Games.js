import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameAPI.getAll()
      .then(res => setGames(res.data.games))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const gameIcons = {
    'image-quiz': '🖼️',
    'drag-drop': '🤚',
    'memory-card': '🧠',
    'word-puzzle': '🧩',
    'fill-blank': '✏️',
    'true-false': '✅',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <h1 style={{ marginBottom: 10 }}>🎮 Fun Games</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Learn while playing! Choose a game and have fun! 🎯</p>

      <div className="categories-grid">
        {games.map((game, i) => (
          <motion.div
            key={game._id}
            className="card category-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="category-icon">{gameIcons[game.gameType] || '🎮'}</span>
            <h3 className="category-title">{game.localizedTitle || game.title?.english}</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 15 }}>{game.localizedInstructions || game.instructions?.english}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 15, flexWrap: 'wrap' }}>
              <span className="badge badge-green">{game.difficulty}</span>
              <span className="badge badge-green">{game.gameType}</span>
              <span className="badge badge-green">⭐ {game.xpReward} XP</span>
            </div>
            <Link to={`/games/${game._id}`} className="btn btn-secondary btn-sm">🎮 Play Now!</Link>
          </motion.div>
        ))}
        {games.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 60, gridColumn: '1/-1' }}>
            <div style={{ fontSize: 60 }}>🎮</div>
            <h3>Games Coming Soon!</h3>
            <p style={{ color: '#666' }}>We're creating exciting new games for you!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;