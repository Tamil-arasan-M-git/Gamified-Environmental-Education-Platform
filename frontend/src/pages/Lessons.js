import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lessonAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Lessons = () => {
  const [searchParams] = useSearchParams();
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, catRes] = await Promise.all([
          lessonAPI.getAll({ category: selectedCategory !== 'all' ? selectedCategory : undefined }),
          lessonAPI.getCategories(),
        ]);
        setLessons(lessonsRes.data.lessons);
        setCategories(catRes.data.categories);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [selectedCategory]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <h1 style={{ marginBottom: 10 }}>📚 Learning Lessons</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Choose a category and start learning about our amazing planet!</p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
        <button className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-sm'}`} onClick={() => setSelectedCategory('all')}>All</button>
        {categories.map(cat => (
          <button key={cat.id} className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-sm'}`} onClick={() => setSelectedCategory(cat.id)}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="categories-grid">
        {lessons.map((lesson, i) => (
          <motion.div
            key={lesson._id}
            className="card category-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="category-icon">{lesson.icon}</span>
            <h3 className="category-title">{lesson.localizedContent?.title || lesson.title}</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 15 }}>{lesson.localizedContent?.description}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 15 }}>
              <span className="badge badge-green">{lesson.difficulty}</span>
              <span className="badge badge-green">⭐ {lesson.xpReward} XP</span>
            </div>
            <Link to={`/lessons/${lesson._id}`} className="btn btn-primary btn-sm">Start Lesson →</Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;