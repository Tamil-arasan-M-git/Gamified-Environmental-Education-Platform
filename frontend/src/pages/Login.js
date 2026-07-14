import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="card auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', fontSize: 60 }}>🌿</div>
        <h2>Welcome Back!</h2>
        <p>Continue your eco-adventure! 🌍</p>

        {error && <div className="card" style={{ background: '#ffebee', color: '#c62828', padding: 15, marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="auth-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Sign up!</Link>
        </div>

        <div className="card" style={{ marginTop: 20, padding: 15, background: '#e8f5e9' }}>
          <p style={{ fontSize: 14 }}>🎮 Demo Accounts:</p>
          <p style={{ fontSize: 13, color: '#666' }}>Admin: admin@ecolearn.com / admin123</p>
          <p style={{ fontSize: 13, color: '#666' }}>Kid: kid@ecolearn.com / kid123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;