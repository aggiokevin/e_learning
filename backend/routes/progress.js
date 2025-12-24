const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.post('/lessons/:lessonId/progress', auth, progressController.updateProgress);

module.exports = router;
