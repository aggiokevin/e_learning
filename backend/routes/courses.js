const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../config/multer');

router.get('/', courseController.getCourses);
// router.get('/published', courseController.getPublishedCourses);
router.get('/:id', courseController.getCourseById);
router.post(
  '/',
  auth,
  roleCheck('TRAINER', 'ADMIN'),
  upload.single('image'), // Nom du champ dans le FormData
  courseController.createCourse
);
router.put(
  '/:id',
  auth,
  roleCheck('TRAINER', 'ADMIN'),
  upload.single('image'),
  courseController.updateCourse
);
router.delete('/:id', auth, roleCheck('ADMIN'), courseController.deleteCourse);
router.post('/:courseId/modules', auth, roleCheck('TRAINER', 'ADMIN'), courseController.createModule);
router.post('/modules/:moduleId/lessons', auth, roleCheck('TRAINER', 'ADMIN'), courseController.createLesson);

// Routes ADMIN uniquement
router.get(
  '/admin/all',
  auth,
  roleCheck('ADMIN'),
  courseController.getAllCoursesAdmin
);

router.patch(
  '/admin/:id/publish',
  auth,
  roleCheck('ADMIN'),
  courseController.togglePublishStatus
);

router.delete(
  '/admin/:id',
  auth,
  roleCheck('ADMIN'),
  courseController.deleteCourseAdmin
);

router.get(
  '/admin/:id/stats',
  auth,
  roleCheck('ADMIN'),
  courseController.getCourseStats
);


module.exports = router;
