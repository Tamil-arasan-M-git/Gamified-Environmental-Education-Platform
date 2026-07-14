const express = require('express');
const router = express.Router();
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  getCategories,
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/categories', protect, getCategories);
router.route('/')
  .get(protect, getLessons)
  .post(protect, authorize('admin'), createLesson);
router.route('/:id')
  .get(protect, getLesson)
  .put(protect, authorize('admin'), updateLesson)
  .delete(protect, authorize('admin'), deleteLesson);

module.exports = router;