import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', language: user?.language || 'english', theme: user?.theme || 'light' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    try {
      const res = await authAPI.updateDetails(form);
      updateUser(res.data.user);
      setEditing(false);
      setMessage('Profile updated! ✅');
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await authAPI.updatePassword(passwordForm);
      setMessage('Password changed! ✅');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error changing password');
    }
  };

  const toggleTheme = () => {
    const newTheme = user?.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    authAPI.updateDetails({ theme: newTheme }).then(() => updateUser({ theme: newTheme }));
  };

  return (
    <div className="profile-page">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="profile-header">
          <div className="profile-avatar">{user?.name?.[0]}</div>
          <h1>{user?.name}</h1>
          <p style={{ color: '#666' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginTop: 15, flexWrap: 'wrap' }}>
            <span className="badge badge-green">Level {user?.level}</span>
            <span className="badge badge-green">⭐ {user?.xp} XP</span>
            <span className="badge badge-green">🪙 {user?.coins} Coins</span>
            <span className="badge badge-green">🔥 {user?.streak || 0} Day Streak</span>
          </div>
        </div>

        {message && <div className="card" style={{ background: '#e8f5e9', padding: 15, marginBottom: 20 }}>{message}</div>}

        <div className="card" style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 20 }}>👤 Profile Settings</h3>
          {editing ? (
            <>
              <div className="input-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Language</label>
                <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                  <option value="english">🇬🇧 English</option>
                  <option value="tamil">🇮🇳 தமிழ் (Tamil)</option>
                  <option value="hindi">🇮🇳 हिन्दी (Hindi)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
                <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          )}
        </div>

        <div className="card" style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 20 }}>🔒 Change Password</h3>
          <div className="input-group">
            <label>Current Password</label>
            <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          </div>
          <button className="btn btn-accent" onClick={handlePasswordChange}>Change Password</button>
        </div>

        <div className="card" style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 20 }}>🎨 Theme</h3>
          <button className={`btn ${user?.theme === 'dark' ? 'btn-primary' : ''}`} onClick={toggleTheme}>
            {user?.theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        <button className="btn btn-danger" onClick={logout} style={{ width: '100%' }}>🚪 Logout</button>
      </motion.div>
    </div>
  );
};

export default Profile;