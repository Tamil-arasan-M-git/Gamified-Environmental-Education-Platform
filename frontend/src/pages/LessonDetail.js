import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lessonAPI, progressAPI, quizAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Confetti from 'react-confetti';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonRes, quizRes] = await Promise.all([
          lessonAPI.getOne(id),
          quizAPI.getAll({ lessonId: id }),
        ]);
        setLesson(lessonRes.data.lesson);
        setQuizzes(quizRes.data.quizzes);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleAnswer = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const isCorrect = answerIndex === quizzes[currentQuiz]?.localizedQuestion?.correctAnswer;
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuiz = () => {
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishLesson();
    }
  };

  const finishLesson = async () => {
    try {
      await progressAPI.completeLesson({ lessonId: id, score: Math.round((score / quizzes.length) * 100) });
      setCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner />;
  if (!lesson) return <div className="dashboard"><h2>Lesson not found</h2></div>;

  const content = lesson.localizedContent;

  if (completed) {
    return (
      <div className="lesson-page">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
        <motion.div className="card" style={{ textAlign: 'center', padding: 60 }} initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div style={{ fontSize: 80 }}>🎉</div>
          <h2>Amazing Job!</h2>
          <p style={{ fontSize: 20, margin: '20px 0' }}>You scored {Math.round((score / quizzes.length) * 100)}%!</p>
          <p>⭐ +20 XP earned! 🪙 +10 Coins earned!</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 30 }}>
            <button className="btn btn-primary" onClick={() => navigate('/lessons')}>📚 More Lessons</button>
            <button className="btn btn-secondary" onClick={() => navigate('/games')}>🎮 Play Games</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <div className="lesson-header">
        <button className="btn btn-sm" onClick={() => navigate('/lessons')}>← Back</button>
        <h1 style={{ marginTop: 20 }}>{content?.title}</h1>
        <p style={{ color: '#666' }}>{content?.description}</p>
      </div>

      <motion.div className="lesson-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3>📖 Learn</h3>
        <p style={{ fontSize: 18, lineHeight: 1.8, margin: '20px 0' }}>{content?.explanation}</p>

        <h3>📝 Vocabulary</h3>
        <div className="lesson-vocab">
          {content?.vocabulary?.map((v, i) => (
            <div key={i} className="vocab-card">
              <div className="vocab-word">{v.word}</div>
              <div className="vocab-meaning">{v.meaning}</div>
              <div className="vocab-meaning" style={{ color: '#4CAF50' }}>{v.translation}</div>
            </div>
          ))}
        </div>

        {content?.miniStory && (
          <>
            <h3>📖 Mini Story</h3>
            <div className="story-box">
              <h4 style={{ marginBottom: 10 }}>{content.miniStory.title}</h4>
              <p style={{ lineHeight: 1.8 }}>{content.miniStory.content}</p>
              <p style={{ marginTop: 15, fontStyle: 'italic', color: '#666' }}>💡 {content.miniStory.moral}</p>
            </div>
          </>
        )}

        {content?.funFacts?.length > 0 && (
          <>
            <h3>🎯 Fun Facts</h3>
            <div className="fun-facts">
              {content.funFacts.map((fact, i) => (
                <div key={i} className="fun-fact">
                  <span>✨</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Quiz Section */}
      {quizzes.length > 0 && (
        <motion.div className="card" style={{ marginTop: 30 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>📝 Quiz Time! ({currentQuiz + 1}/{quizzes.length})</h3>
          <div className="game-area">
            <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
              {quizzes[currentQuiz]?.localizedQuestion?.text}
            </p>
            <div className="quiz-options">
              {quizzes[currentQuiz]?.localizedQuestion?.options?.map((opt, i) => (
                <button
                  key={i}
                  className={`quiz-option ${showResult ? (i === quizzes[currentQuiz]?.localizedQuestion?.correctAnswer ? 'correct' : i === selectedAnswer ? 'wrong' : '') : ''}`}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showResult && (
              <div style={{ marginTop: 20 }}>
                <p style={{ color: selectedAnswer === quizzes[currentQuiz]?.localizedQuestion?.correctAnswer ? '#4CAF50' : '#f44336', fontWeight: 700 }}>
                  {selectedAnswer === quizzes[currentQuiz]?.localizedQuestion?.correctAnswer ? '✅ Correct!' : '❌ Not quite!'}
                </p>
                <p style={{ color: '#666', marginTop: 10 }}>{quizzes[currentQuiz]?.localizedQuestion?.explanation}</p>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={nextQuiz}>
                  {currentQuiz < quizzes.length - 1 ? 'Next Question →' : '🎉 Finish Lesson'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LessonDetail;