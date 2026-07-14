const express = require('express');
const router = express.Router();
const {
  getProgress,
  completeLesson,
  getChildrenProgress,
  updateTimeSpent,
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProgress);
router.post('/complete-lesson', protect, completeLesson);
router.get('/children', protect, authorize('parent'), getChildrenProgress);
router.put('/time', protect, updateTimeSpent);

module.exports = router;