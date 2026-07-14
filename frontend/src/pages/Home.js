import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="home-page">
      <div className="animated-background">
        <div className="floating-tree">🌳</div>
        <div className="floating-tree">🌲</div>
        <div className="floating-tree">🌴</div>
        <div className="floating-tree">🌳</div>
        <div className="floating-cloud">☁️</div>
        <div className="floating-cloud">⛅</div>
        <div className="floating-cloud">☁️</div>
        <div className="floating-bird">🦅</div>
        <div className="floating-bird">🕊️</div>
        <div className="floating-sun">☀️</div>
      </div>

      <div className="hero-section">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ fontSize: 100, marginBottom: 20 }}
        >
          🌍
        </motion.div>

        <h1 className="hero-title">EcoLearn Adventure!</h1>
        <p className="hero-subtitle">
          🌿 Learn about the environment through fun games, exciting challenges, and amazing adventures!
          Join thousands of kids saving our planet!
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-lg pulse-anim">
            🚀 Start Learning
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            👋 Login
          </Link>
        </div>

        <motion.div
          className="slide-up"
          style={{ marginTop: 60, display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <div className="card" style={{ textAlign: 'center', padding: 20, minWidth: 150 }}>
            <div style={{ fontSize: 40 }}>🎮</div>
            <h3>6+ Games</h3>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20, minWidth: 150 }}>
            <div style={{ fontSize: 40 }}>📚</div>
            <h3>8 Categories</h3>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20, minWidth: 150 }}>
            <div style={{ fontSize: 40 }}>🏆</div>
            <h3>Badges & Rewards</h3>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20, minWidth: 150 }}>
            <div style={{ fontSize: 40 }}>🌍</div>
            <h3>3 Languages</h3>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;