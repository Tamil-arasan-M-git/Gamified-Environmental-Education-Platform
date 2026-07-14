import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getUsers(),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
        setMessage('User deleted ✅');
      } catch (err) { setMessage('Error deleting user'); }
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.updateUserRole(id, { role });
      setUsers(users.map(u => u._id === id ? { ...u, role } : u));
      setMessage('Role updated ✅');
    } catch (err) { setMessage('Error updating role'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: 10 }}>⚙️ Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Manage your EcoLearn platform</p>

      {message && <div className="card" style={{ background: '#e8f5e9', padding: 15, marginBottom: 20 }}>{message}</div>}

      {stats && (
        <div className="admin-stats">
          <div className="card admin-stat"><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
          <div className="card admin-stat"><h3>{stats.totalChildren}</h3><p>Children</p></div>
          <div className="card admin-stat"><h3>{stats.totalParents}</h3><p>Parents</p></div>
          <div className="card admin-stat"><h3>{stats.totalLessons}</h3><p>Lessons</p></div>
          <div className="card admin-stat"><h3>{stats.totalQuizzes}</h3><p>Quizzes</p></div>
          <div className="card admin-stat"><h3>{stats.totalGames}</h3><p>Games</p></div>
          <div className="card admin-stat"><h3>{stats.totalXp}</h3><p>Total XP</p></div>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <h3 style={{ marginBottom: 20 }}>👥 User Management</h3>
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Level</th>
              <th>XP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="user-avatar" style={{ width: 30, height: 30, fontSize: 14 }}>{u.name?.[0]}</div>
                    {u.name}
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} style={{ padding: 5, borderRadius: 8, border: '1px solid #ddd' }}>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{u.level}</td>
                <td>⭐ {u.xp}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;