import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, lessonAPI, progressAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminAPI.getDashboard().catch(() => null),
          adminAPI.getUsers().catch(() => null),
        ]);
        if (statsRes) setStats(statsRes.data.stats);
        if (usersRes) {
          const allUsers = usersRes.data.users || [];
          setStudents(allUsers.filter(u => u.role === 'child'));
        }
        // Simulate classes
        setClasses([
          { id: 1, name: 'Grade 3 - Environment', students: 12, lessons: 8 },
          { id: 2, name: 'Grade 4 - Science', students: 15, lessons: 10 },
          { id: 3, name: 'Grade 5 - Eco Club', students: 10, lessons: 6 },
        ]);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <h1>👨‍🏫 Teacher Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Manage your classes and track student progress</p>

      <div style={{ display: 'flex', gap: 15, marginBottom: 30, flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</button>
        <button className={`btn ${activeTab === 'classes' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('classes')}>🏫 My Classes</button>
        <button className={`btn ${activeTab === 'students' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('students')}>👥 Students</button>
        <button className={`btn ${activeTab === 'assign' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('assign')}>📝 Assign Work</button>
      </div>

      {stats && (
        <div className="admin-stats">
          <div className="card admin-stat"><h3>{classes.length}</h3><p>My Classes</p></div>
          <div className="card admin-stat"><h3>{students.length}</h3><p>Total Students</p></div>
          <div className="card admin-stat"><h3>{stats.totalLessons || 20}</h3><p>Available Lessons</p></div>
          <div className="card admin-stat"><h3>{stats.totalQuizzes || 15}</h3><p>Quizzes</p></div>
          <div className="card admin-stat"><h3>{stats.totalXp || 1250}</h3><p>Class Total XP</p></div>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="categories-grid">
          {classes.map((cls, i) => (
            <motion.div key={cls.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <h3>🏫 {cls.name}</h3>
              <p style={{ margin: '10px 0', color: '#666' }}>👥 {cls.students} students</p>
              <p style={{ color: '#666' }}>📚 {cls.lessons} lessons assigned</p>
              <div className="progress-bar" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${Math.min(100, cls.students * 7)}%` }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
                <button className="btn btn-primary btn-sm">📊 View</button>
                <button className="btn btn-secondary btn-sm">📝 Assign</button>
              </div>
            </motion.div>
          ))}
          <div className="card category-card" onClick={() => alert('Create new class form coming soon!')}>
            <div style={{ fontSize: 40 }}>➕</div>
            <h3>Create New Class</h3>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="admin-users-table">
            <thead>
              <tr><th>Student</th><th>Level</th><th>XP</th><th>Coins</th><th>Lessons</th><th>Streak</th><th>Last Active</th></tr>
            </thead>
            <tbody>
              {students.slice(0, 20).map((s, i) => (
                <motion.tr key={s._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="user-avatar" style={{ width: 30, height: 30, fontSize: 14 }}>{s.name?.[0]}</div>{s.name}</div></td>
                  <td>{s.level || 1}</td>
                  <td>⭐ {s.xp || 0}</td>
                  <td>🪙 {s.coins || 0}</td>
                  <td>{s.completedLessons?.length || 0}</td>
                  <td>🔥 {s.streak || 0}d</td>
                  <td>{s.lastLoginDate ? new Date(s.lastLoginDate).toLocaleDateString() : '-'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'assign' && (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 60 }}>📝</div>
          <h3>Assign Lessons & Homework</h3>
          <p style={{ color: '#666', margin: '20px 0' }}>Select a class and assign lessons, quizzes, or games as homework.</p>
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ maxWidth: 300 }}>
              <label>Select Class</label>
              <select><option>Grade 3 - Environment</option><option>Grade 4 - Science</option><option>Grade 5 - Eco Club</option></select>
            </div>
            <div className="input-group" style={{ maxWidth: 300 }}>
              <label>Select Lesson</label>
              <select><option>Importance of Trees</option><option>Water Cycle</option><option>Types of Trees</option></select>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>📤 Assign to Class</button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;