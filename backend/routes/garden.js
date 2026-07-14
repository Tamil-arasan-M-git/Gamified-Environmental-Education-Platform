const express = require('express');
const router = express.Router();
const { getGarden, plantItem, waterGarden } = require('../controllers/gardenController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getGarden);
router.post('/plant', protect, plantItem);
router.post('/water', protect, waterGarden);

module.exports = router;