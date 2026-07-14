import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gameAPI, questionsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Confetti from 'react-confetti';

const GamePlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('start');
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [stars, setStars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [usedIds, setUsedIds] = useState(new Set());
  const [difficulty, setDifficulty] = useState('easy');
  const [hintUsed, setHintUsed] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [dragItems, setDragItems] = useState([]);
  const [droppedItems, setDroppedItems] = useState({});
  const [wordInput, setWordInput] = useState('');
  const timerRef = useRef(null);
  const questionPoolRef = useRef([]);
  const answeredRef = useRef(new Set());

  useEffect(() => {
    gameAPI.getOne(id)
      .then(res => {
        setGame(res.data.game);
        const content = res.data.game.localizedContent || res.data.game.content?.english;
        // Initialize game-specific state
        if (res.data.game.gameType === 'memory-card') {
          const cards = content?.cards || [];
          const shuffled = [...cards, ...cards].sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, uid: i }));
          setFlippedCards([]);
          setMatchedCards([]);
          setQuestions(shuffled);
        } else if (res.data.game.gameType === 'drag-drop') {
          const items = content?.dragItems || [];
          setDragItems(items.sort(() => Math.random() - 0.5));
          setDroppedItems({});
        } else {
          setQuestions(content?.questions || content?.trueFalse || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch questions from API based on difficulty
  const fetchQuestions = useCallback(async (diff) => {
    try {
      const res = await questionsAPI.getRandom({ count: 20, difficulty: diff });
      const qs = res.data.questions || [];
      questionPoolRef.current = qs;
      answeredRef.current = new Set();
      return qs;
    } catch (err) {
      return [];
    }
  }, []);

  const startGame = async (diff) => {
    setDifficulty(diff);
    const timeMap = { easy: 120, medium: 90, hard: 60 };
    setTimeLeft(timeMap[diff] || 60);
    setScore(0);
    setLives(3);
    setCombo(0);
    setStars(0);
    setCorrectCount(0);
    setCurrentQ(0);
    setScreen('playing');
    setIsPaused(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setHintUsed(false);
    setUsedIds(new Set());
    setWordInput('');

    // Fetch fresh questions for this difficulty
    const freshQs = await fetchQuestions(diff);
    if (freshQs.length > 0) {
      setQuestions(freshQs);
    } else {
      // Fallback to game's built-in questions
      const content = game?.localizedContent || game?.content?.english;
      const qs = content?.questions || content?.trueFalse || [];
      setQuestions(qs.sort(() => Math.random() - 0.5));
    }
  };

  useEffect(() => {
    if (screen === 'playing' && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, isPaused, timeLeft]);

  const togglePause = () => setIsPaused(!isPaused);

  const getNextQuestion = () => {
    // Filter out used questions
    const available = questions.filter(q => !answeredRef.current.has(q.id || q._id));
    if (available.length === 0) {
      // Refetch more questions
      fetchQuestions(difficulty).then(newQs => {
        if (newQs.length > 0) {
          answeredRef.current = new Set();
          setQuestions(newQs);
        } else {
          endGame();
        }
      });
      return null;
    }
    const idx = Math.floor(Math.random() * available.length);
    const q = available[idx];
    answeredRef.current.add(q.id || q._id);
    return q;
  };

  const handleAnswer = (answerIdx) => {
    if (showResult || isPaused) return;
    setSelectedAnswer(answerIdx);
    setShowResult(true);
    const q = questions[currentQ];
    if (!q) return;
    const correct = q.correctAnswer !== undefined ? q.correctAnswer : (q.answer ? 0 : 1);
    const isCorrect = answerIdx === correct;
    if (isCorrect) {
      const bonus = combo * 2;
      setScore(s => s + 10 + bonus);
      setCombo(c => c + 1);
      setCorrectCount(c => c + 1);
      if (combo >= 3) setStars(s => Math.min(s + 1, 5));
    } else {
      setCombo(0);
      setLives(l => {
        if (l - 1 <= 0) setTimeout(() => endGame(), 800);
        return l - 1;
      });
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1 && lives > 0) {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHintUsed(false);
    } else if (lives > 0) {
      endGame();
    }
  };

  const useHint = () => {
    setHintUsed(true);
    setScore(s => Math.max(0, s - 2));
  };

  const endGame = async () => {
    clearInterval(timerRef.current);
    setScreen('gameover');
    try {
      await gameAPI.complete({ gameId: id, score, correctCount, total: questions.length });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) { console.error(err); }
  };

  const restart = () => setScreen('start');

  // Memory card flip handler
  const handleCardFlip = (uid) => {
    if (flippedCards.length >= 2 || matchedCards.includes(uid)) return;
    const newFlipped = [...flippedCards, uid];
    setFlippedCards(newFlipped);
    if (newFlipped.length === 2) {
      const card1 = questions.find(c => c.uid === newFlipped[0]);
      const card2 = questions.find(c => c.uid === newFlipped[1]);
      if (card1 && card2 && card1.matchId === card2.matchId) {
        setMatchedCards(m => [...m, newFlipped[0], newFlipped[1]]);
        setScore(s => s + 10);
        setCombo(c => c + 1);
        setTimeout(() => setFlippedCards([]), 500);
        if (matchedCards.length + 2 >= questions.length) {
          setTimeout(() => endGame(), 500);
        }
      } else {
        setCombo(0);
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (item.category === category) {
      setScore(s => s + 10);
      setCombo(c => c + 1);
      setCorrectCount(c => c + 1);
    } else {
      setCombo(0);
    }
    setDroppedItems(d => ({ ...d, [item.id]: category }));
    setDragItems(items => items.filter(i => i.id !== item.id));
  };

  const handleDragOver = (e) => e.preventDefault();

  if (loading) return <LoadingSpinner />;
  if (!game) return <div className="dashboard"><h2>Game not found</h2></div>;

  const content = game.localizedContent || game.content?.english;
  const q = questions[currentQ];
  const isQuiz = game.gameType === 'image-quiz' || game.gameType === 'true-false' || !game.gameType;

  // Start Screen
  if (screen === 'start') {
    return (
      <div className="game-container">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
        <motion.div className="card" style={{ textAlign: 'center', padding: 60 }} initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎮</div>
          <h2>{game.localizedTitle || game.title?.english || 'Fun Game'}</h2>
          <p style={{ margin: '20px 0', fontSize: 18 }}>{game.localizedInstructions || game.instructions?.english}</p>
          <p style={{ color: '#666', marginBottom: 20 }}>⭐ {game.xpReward} XP | 🪙 {game.coinReward} Coins</p>
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => startGame('easy')}>🌱 Easy</button>
            <button className="btn btn-secondary" onClick={() => startGame('medium')}>🌿 Medium</button>
            <button className="btn btn-danger" onClick={() => startGame('hard')}>🔥 Hard</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Over Screen
  if (screen === 'gameover') {
    const total = questions.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div className="game-container">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
        <motion.div className="card" style={{ textAlign: 'center', padding: 60 }} initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div style={{ fontSize: 80 }}>{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}</div>
          <h2>{pct >= 80 ? 'Amazing!' : pct >= 50 ? 'Good Job!' : 'Keep Trying!'}</h2>
          <div style={{ fontSize: 48, margin: '20px 0', fontWeight: 700 }}>{score}</div>
          <p style={{ fontSize: 18 }}>Score: {correctCount}/{total} correct ({pct}%)</p>
          <p>Stars: {'⭐'.repeat(Math.min(stars, 5))} | Combo: 🔥{combo}x</p>
          <p style={{ color: '#666', marginTop: 10 }}>⭐ +{game.xpReward} XP | 🪙 +{game.coinReward} Coins</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 30 }}>
            <button className="btn btn-primary" onClick={restart}>🔁 Play Again</button>
            <button className="btn btn-secondary" onClick={() => navigate('/games')}>🎮 More Games</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="game-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div className="card" style={{ padding: '8px 16px' }}>⭐ {score}</div>
        <div className="card" style={{ padding: '8px 16px' }}>❤️ {'❤️'.repeat(Math.max(0, lives))}</div>
        <div className="card" style={{ padding: '8px 16px' }}>🔥 {combo}x</div>
        <div className="card" style={{ padding: '8px 16px', background: timeLeft < 10 ? '#ffebee' : undefined }}>
          ⏱️ {timeLeft}s
        </div>
        <button className="btn btn-sm" onClick={togglePause}>{isPaused ? '▶ Resume' : '⏸ Pause'}</button>
        <button className="btn btn-sm btn-danger" onClick={endGame}>✕ Quit</button>
      </div>

      {isQuiz && questions.length > 0 && (
        <div className="progress-bar" style={{ marginBottom: 20 }}>
          <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isPaused ? (
          <motion.div key={currentQ} className="game-area" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            {/* QUIZ / TRUE-FALSE GAMES */}
            {isQuiz && q && (
              <>
                {q.imageUrl && <img src={q.imageUrl} alt="quiz" style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }} />}
                <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{q.question || q.questionText || q.statement || 'Question'}</p>
                {!showResult && !hintUsed && (
                  <button className="btn btn-sm" onClick={useHint} style={{ marginBottom: 10 }}>💡 Hint (-2 pts)</button>
                )}
                {hintUsed && q.explanation && <p style={{ color: '#666', marginBottom: 10, fontStyle: 'italic' }}>💡 {q.explanation}</p>}
                <div className="quiz-options">
                  {(q.options || (q.statement ? ['True', 'False'] : ['A', 'B', 'C', 'D'])).map((opt, i) => (
                    <button key={i}
                      className={`quiz-option ${showResult ? (i === (q.correctAnswer !== undefined ? q.correctAnswer : (q.answer ? 0 : 1)) ? 'correct' : i === selectedAnswer ? 'wrong' : '') : ''}`}
                      onClick={() => handleAnswer(i)} disabled={showResult}>
                      {opt}
                    </button>
                  ))}
                </div>
                {showResult && (
                  <div style={{ marginTop: 20 }}>
                    <p style={{ color: selectedAnswer === (q.correctAnswer !== undefined ? q.correctAnswer : (q.answer ? 0 : 1)) ? '#4CAF50' : '#f44336', fontWeight: 700, fontSize: 18 }}>
                      {selectedAnswer === (q.correctAnswer !== undefined ? q.correctAnswer : (q.answer ? 0 : 1)) ? '✅ Correct!' : '❌ Wrong'}
                    </p>
                    {q.explanation && <p style={{ color: '#666', marginTop: 10 }}>{q.explanation}</p>}
                    <button className="btn btn-primary" style={{ marginTop: 15 }} onClick={nextQuestion} disabled={lives <= 0}>
                      {currentQ < questions.length - 1 && lives > 0 ? 'Next →' : '🎉 Finish'}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* MEMORY CARD GAME */}
            {game.gameType === 'memory-card' && (
              <>
                <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Match the pairs! ({matchedCards.length / 2}/{questions.length / 2})</p>
                <div className="memory-grid">
                  {questions.map((card) => (
                    <div key={card.uid}
                      className={`memory-card ${flippedCards.includes(card.uid) || matchedCards.includes(card.uid) ? 'flipped' : ''} ${matchedCards.includes(card.uid) ? 'matched' : ''}`}
                      onClick={() => handleCardFlip(card.uid)}
                      style={{ fontSize: 24 }}>
                      {flippedCards.includes(card.uid) || matchedCards.includes(card.uid) ? card.label || card.name || '?' : '❓'}
                    </div>
                  ))}
                </div>
                {matchedCards.length >= questions.length && (
                  <button className="btn btn-primary" style={{ marginTop: 30 }} onClick={endGame}>🎉 Complete!</button>
                )}
              </>
            )}

            {/* DRAG & DROP GAME */}
            {game.gameType === 'drag-drop' && (
              <>
                <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Sort items into correct categories!</p>
                <div className="drag-container">
                  <div>
                    <h4>Items to sort ({dragItems.length})</h4>
                    <div className="drag-items">
                      {dragItems.map((item) => (
                        <div key={item.id} className="drag-item" draggable onDragStart={(e) => handleDragStart(e, item)}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4>Drop Zones</h4>
                    <div className="drop-zones">
                      {['plastic', 'paper', 'glass', 'organic'].map(cat => (
                        <div key={cat} className="drop-zone" onDrop={(e) => handleDrop(e, cat)} onDragOver={handleDragOver}>
                          <strong>{cat.toUpperCase()}</strong>
                          <div>{Object.entries(droppedItems).filter(([_, v]) => v === cat).length} items</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {dragItems.length === 0 && (
                  <button className="btn btn-primary" style={{ marginTop: 30 }} onClick={endGame}>🎉 All Sorted!</button>
                )}
              </>
            )}

            {/* WORD PUZZLE */}
            {game.gameType === 'word-puzzle' && (
              <>
                <div style={{ fontSize: 48, letterSpacing: 20, fontWeight: 700, userSelect: 'none' }}>
                  {(content?.puzzle?.scrambled || '????').split('').map((c, i) => (
                    <motion.span key={i} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>{c}</motion.span>
                  ))}
                </div>
                <p style={{ margin: '20px 0', color: '#666' }}>💡 Hint: {content?.puzzle?.hint}</p>
                <div className="input-group" style={{ maxWidth: 300 }}>
                  <input placeholder="Type the word..." value={wordInput} onChange={(e) => setWordInput(e.target.value)} />
                </div>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => {
                  if (wordInput.toUpperCase() === (content?.puzzle?.word || '').toUpperCase()) {
                    setScore(s => s + 20);
                    setCorrectCount(c => c + 1);
                  }
                  endGame();
                }}>Check ✓</button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div className="game-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontSize: 60 }}>⏸️</div>
            <h2>Game Paused</h2>
            <p style={{ margin: '20px 0', color: '#666' }}>Take a break! Click Resume to continue.</p>
            <button className="btn btn-primary btn-lg" onClick={togglePause}>▶ Resume</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePlay;