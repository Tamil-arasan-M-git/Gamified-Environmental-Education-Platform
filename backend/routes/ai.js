const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAdaptiveLearning,
  getAiTutor,
  getRevisionSession,
  calculateCarbonFootprint,
  getReportCard,
  getLearningPath,
} = require('../controllers/aiController');

router.get('/adaptive-learning', protect, getAdaptiveLearning);
router.post('/tutor', protect, getAiTutor);
router.get('/revision', protect, getRevisionSession);
router.post('/carbon-footprint', protect, calculateCarbonFootprint);
router.get('/report-card', protect, getReportCard);
router.get('/learning-path', protect, getLearningPath);

module.exports = router;