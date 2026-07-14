import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', language: 'english' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, age: parseInt(form.age) });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <motion.div className="card auth-card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center', fontSize: 60 }}>🌱</div>
        <h2>Join EcoLearn!</h2>
        <p>Start your environmental adventure! 🌍</p>
        {error && <div className="card" style={{ background: '#ffebee', color: '#c62828', padding: 15, marginBottom: 20 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your name" />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} required min="3" max="18" placeholder="Your age" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength="6" placeholder="Create a password" />
          </div>
          <div className="input-group">
            <label>Preferred Language</label>
            <select name="language" value={form.language} onChange={handleChange}>
              <option value="english">🇬🇧 English</option>
              <option value="tamil">🇮🇳 தமிழ் (Tamil)</option>
              <option value="hindi">🇮🇳 हिन्दी (Hindi)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-secondary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : '🚀 Start Learning!'}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Login!</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;