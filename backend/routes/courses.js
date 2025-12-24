const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', auth, roleCheck('TRAINER', 'ADMIN'), courseController.createCourse);
router.put('/:id', auth, roleCheck('TRAINER', 'ADMIN'), courseController.updateCourse);
router.delete('/:id', auth, roleCheck('ADMIN'), courseController.deleteCourse);
router.post('/:courseId/modules', auth, roleCheck('TRAINER', 'ADMIN'), courseController.createModule);
router.post('/modules/:moduleId/lessons', auth, roleCheck('TRAINER', 'ADMIN'), courseController.createLesson);

module.exports = router;
