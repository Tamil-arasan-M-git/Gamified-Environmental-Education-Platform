const express = require('express');
const router = express.Router();
const { getWorlds, seedWorlds } = require('../controllers/worldController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWorlds);
router.post('/seed', protect, seedWorlds);

module.exports = router;