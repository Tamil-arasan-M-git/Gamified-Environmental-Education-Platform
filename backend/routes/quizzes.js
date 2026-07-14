const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitAnswer,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.post('/submit', protect, submitAnswer);
router.route('/')
  .get(protect, getQuizzes)
  .post(protect, authorize('admin'), createQuiz);
router.route('/:id')
  .get(protect, getQuiz)
  .put(protect, authorize('admin'), updateQuiz)
  .delete(protect, authorize('admin'), deleteQuiz);

module.exports = router;