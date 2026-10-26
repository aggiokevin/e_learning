const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Toutes les routes nécessitent auth + ADMIN
router.get('/global', auth, roleCheck('ADMIN'), analyticsController.getGlobalStats);
router.get('/period', auth, roleCheck('ADMIN'), analyticsController.getStatsByPeriod);
router.get('/top-courses', auth, roleCheck('ADMIN'), analyticsController.getTopCourses);
router.get('/categories', auth, roleCheck('ADMIN'), analyticsController.getCategoryDistribution);
router.get('/top-trainers', auth, roleCheck('ADMIN'), analyticsController.getTopTrainers);
router.get('/completion-rates', auth, roleCheck('ADMIN'), analyticsController.getCompletionRates);
router.get('/recent-activity', auth, roleCheck('ADMIN'), analyticsController.getRecentActivity);

module.exports = router;
