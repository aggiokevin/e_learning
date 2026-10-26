const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.get('/modules/:moduleId/quiz', auth, quizController.getQuizByModule);
router.post('/quizzes/:quizId/attempts', auth, quizController.startQuizAttempt);
router.post('/quiz-attempts/:attemptId/answers', auth, quizController.submitAnswers);

module.exports = router;
