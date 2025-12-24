const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

router.post('/courses/:courseId/enroll', auth, enrollmentController.enrollInCourse);
router.get('/my/courses', auth, enrollmentController.getMyCourses);
router.get('/my/courses/:courseId/progress', auth, enrollmentController.getCourseProgress);

module.exports = router;
