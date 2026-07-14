import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import EcoBuddyChatbot from './components/EcoBuddyChatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Games from './pages/Games';
import GamePlay from './pages/GamePlay';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import ParentDashboard from './pages/ParentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import LoadingSpinner from './components/LoadingSpinner';

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" />;
  return children;
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
        <Route path="/lessons/:id" element={<PrivateRoute><LessonDetail /></PrivateRoute>} />
        <Route path="/games" element={<PrivateRoute><Games /></PrivateRoute>} />
        <Route path="/games/:id" element={<PrivateRoute><GamePlay /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/parent" element={<PrivateRoute roles={['parent', 'admin']}><ParentDashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/teacher" element={<PrivateRoute roles={['admin', 'teacher']}><TeacherDashboard /></PrivateRoute>} />
      </Routes>
      {isAuthenticated && <EcoBuddyChatbot />}
    </div>
  );
};

export default App;