import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { progressAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressAPI.getChildren()
      .then(res => setChildren(res.data.children))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <h1 style={{ marginBottom: 10 }}>👨‍👩‍👧 Parent Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Track your child's learning progress!</p>

      {children.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 60 }}>👶</div>
          <h3>No Children Linked</h3>
          <p style={{ color: '#666' }}>Register your child's account and link it to your parent account to track progress.</p>
        </div>
      ) : (
        children.map((child, i) => (
          <motion.div key={child._id} className="card" style={{ marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div className="user-avatar" style={{ width: 60, height: 60, fontSize: 28 }}>{child.name?.[0]}</div>
              <div style={{ flex: 1 }}>
                <h3>{child.name} <span className="badge badge-green">Age {child.age}</span></h3>
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', marginTop: 10 }}>
                  <span>⭐ Level {child.level}</span>
                  <span>🪙 {child.coins} Coins</span>
                  <span>🔥 {child.streak || 0} Day Streak</span>
                  <span>📚 {child.completedCount} Lessons</span>
                  <span>⏱️ {Math.floor(child.totalTimeSpent / 60)}h {child.totalTimeSpent % 60}m</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 10, maxWidth: 400 }}>
                  <div className="progress-fill" style={{ width: `${child.completionPercentage}%` }} />
                </div>
                <small style={{ color: '#666' }}>{child.completionPercentage}% Complete</small>
              </div>
            </div>
            {child.badges?.length > 0 && (
              <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                {child.badges.map((b, idx) => (
                  <span key={idx} className="badge badge-gold">{b.name}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ParentDashboard;