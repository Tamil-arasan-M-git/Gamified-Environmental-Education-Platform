import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-logo">🌿 EcoLearn</Link>
        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
          <Link to="/lessons" className={`nav-link ${isActive('/lessons')}`}>📚 Lessons</Link>
          <Link to="/games" className={`nav-link ${isActive('/games')}`}>🎮 Games</Link>
          <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard')}`}>🏆 Leaderboard</Link>
          {user?.role === 'parent' && (
            <Link to="/parent" className={`nav-link ${isActive('/parent')}`}>👨‍👩‍👧 Parent</Link>
          )}
          {user?.role === 'teacher' && (
            <Link to="/teacher" className={`nav-link ${isActive('/teacher')}`}>👨‍🏫 Teacher</Link>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>⚙️ Admin</Link>
              <Link to="/teacher" className={`nav-link ${isActive('/teacher')}`}>👨‍🏫 Teacher</Link>
            </>
          )}
        </div>
      </div>
      <div className="nav-right">
        <div className="user-badge">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <span>{user?.name}</span>
          <span className="badge badge-green">Lv.{user?.level}</span>
          <span>⭐ {user?.xp}</span>
          <span>🪙 {user?.coins}</span>
          <Link to="/profile" className="nav-link btn-sm">Profile</Link>
          <button onClick={logout} className="btn btn-danger btn-sm">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;