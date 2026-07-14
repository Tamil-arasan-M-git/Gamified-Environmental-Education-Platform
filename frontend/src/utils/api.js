import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.get('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  updateDetails: (data) => API.put('/auth/updatedetails', data),
  updatePassword: (data) => API.put('/auth/updatepassword', data),
  forgotPassword: (data) => API.post('/auth/forgotpassword', data),
};

export const lessonAPI = {
  getAll: (params) => API.get('/lessons', { params }),
  getOne: (id) => API.get(`/lessons/${id}`),
  create: (data) => API.post('/lessons', data),
  update: (id, data) => API.put(`/lessons/${id}`, data),
  delete: (id) => API.delete(`/lessons/${id}`),
  getCategories: () => API.get('/lessons/categories'),
};

export const quizAPI = {
  getAll: (params) => API.get('/quizzes', { params }),
  getOne: (id) => API.get(`/quizzes/${id}`),
  create: (data) => API.post('/quizzes', data),
  submit: (data) => API.post('/quizzes/submit', data),
};

export const gameAPI = {
  getAll: (params) => API.get('/games', { params }),
  getOne: (id) => API.get(`/games/${id}`),
  complete: (data) => API.post('/games/complete', data),
};

export const leaderboardAPI = {
  get: (params) => API.get('/leaderboard', { params }),
  getMyPosition: () => API.get('/leaderboard/me'),
};

export const progressAPI = {
  get: () => API.get('/progress'),
  completeLesson: (data) => API.post('/progress/complete-lesson', data),
  getChildren: () => API.get('/progress/children'),
  updateTime: (data) => API.put('/progress/time', data),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  updateUserRole: (id, data) => API.put(`/admin/users/${id}/role`, data),
};

export const challengeAPI = {
  getToday: () => API.get('/daily-challenge'),
  complete: (data) => API.post('/daily-challenge/complete', data),
};

export const worldAPI = {
  getAll: () => API.get('/worlds'),
  seed: () => API.post('/worlds/seed'),
};

export const gardenAPI = {
  get: () => API.get('/garden'),
  plant: (data) => API.post('/garden/plant', data),
  water: () => API.post('/garden/water'),
};

export const questionsAPI = {
  getRandom: (params) => API.get('/questions/random', { params }),
  getByCategory: (cat, params) => API.get(`/questions/category/${cat}`, { params }),
  getByGame: (gameType, params) => API.get(`/questions/game/${gameType}`, { params }),
  getAll: (params) => API.get('/questions', { params }),
};

export const aiAPI = {
  getAdaptiveLearning: () => API.get('/ai/adaptive-learning'),
  tutor: (data) => API.post('/ai/tutor', data),
  getRevision: () => API.get('/ai/revision'),
  carbonFootprint: (data) => API.post('/ai/carbon-footprint', data),
  getReportCard: () => API.get('/ai/report-card'),
  getLearningPath: () => API.get('/ai/learning-path'),
};

export default API;