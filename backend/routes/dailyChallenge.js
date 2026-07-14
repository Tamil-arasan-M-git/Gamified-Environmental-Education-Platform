const express = require('express');
const router = express.Router();
const {
  getTodaysChallenge,
  completeChallenge,
  createChallenge,
} = require('../controllers/dailyChallengeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getTodaysChallenge);
router.post('/complete', protect, completeChallenge);
router.post('/', protect, authorize('admin'), createChallenge);

module.exports = router;