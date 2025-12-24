const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/trainer', auth, roleCheck('TRAINER'), dashboardController.getTrainerDashboard);
router.get('/admin', auth, roleCheck('ADMIN'), dashboardController.getAdminDashboard);

module.exports = router;
