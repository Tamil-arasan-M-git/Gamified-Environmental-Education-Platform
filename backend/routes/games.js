const express = require('express');
const router = express.Router();
const {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  completeGame,
} = require('../controllers/gameController');
const { protect, authorize } = require('../middleware/auth');

router.post('/complete', protect, completeGame);
router.route('/')
  .get(protect, getGames)
  .post(protect, authorize('admin'), createGame);
router.route('/:id')
  .get(protect, getGame)
  .put(protect, authorize('admin'), updateGame)
  .delete(protect, authorize('admin'), deleteGame);

module.exports = router;