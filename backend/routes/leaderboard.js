const express = require('express');
const router = express.Router();
const { getLeaderboard, getMyPosition } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMyPosition);
router.get('/', protect, getLeaderboard);

module.exports = router;