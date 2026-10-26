const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizControllers');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Routes FORMATEUR - Créer, modifier, supprimer
router.post(
  '/',
  auth,
  roleCheck('TRAINER', 'ADMIN'),
  quizController.createQuiz
);

router.put(
  '/:id',
  auth,
  roleCheck('TRAINER', 'ADMIN'),
  quizController.updateQuiz
);

router.delete(
  '/:id',
  auth,
  roleCheck('TRAINER', 'ADMIN'),
  quizController.deleteQuiz
);

// Routes ÉTUDIANT - Passer un quiz
router.post(
  '/:quizid/start',
  auth,
  roleCheck('TRAINEE'),
  quizController.startQuizAttempt
);

router.post(
  '/attempt/submit',
  auth,
  roleCheck('TRAINEE'),
  quizController.submitQuizAnswers
);

router.get(
  '/attempt/:attemptid/results',
  auth,
  roleCheck('TRAINEE'),
  quizController.getQuizResults
);

// Routes publiques (authentifiées) - Récupérer quizzes
router.get(
  '/module/:moduleid',
  auth,
  quizController.getQuizzesByModule
);

router.get(
  '/:id',
  auth,
  quizController.getQuizById
);

module.exports = router;
