const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/lessons/:lessonId/progress', auth, roleCheck('TRAINER','ADMIN','TRAINEE'), progressController.updateProgress);

module.exports = router;
