const { pool } = require('../config/database');

exports.getQuizByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const [quizzes] = await pool.query(
      'SELECT * FROM quizzes WHERE module_id = ?',
      [moduleId]
    );

    if (quizzes.length === 0) {
      return res.json({ quiz: null });
    }

    const quiz = quizzes[0];

    // Récupérer les questions
    const [questions] = await pool.query(
      'SELECT * FROM questions WHERE quiz_id = ?',
      [quiz.id]
    );

    // Pour chaque question, récupérer les options
    for (let question of questions) {
      const [options] = await pool.query(
        'SELECT id, option_text FROM options WHERE question_id = ?',
        [question.id]
      );
      question.options = options;
    }

    quiz.questions = questions;

    res.json({ quiz });
  } catch (error) {
    console.error('Erreur lors de la récupération du quiz:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.startQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO quiz_attempts (user_id, quiz_id) VALUES (?, ?)',
      [userId, quizId]
    );

    // Récupérer les questions du quiz
    const [questions] = await pool.query(`
      SELECT q.*, 
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'option_text', option_text))
       FROM options WHERE question_id = q.id) as options
      FROM questions q
      WHERE q.quiz_id = ?
    `, [quizId]);

    res.json({
      attemptId: result.insertId,
      questions
    });
  } catch (error) {
    console.error('Erreur lors du démarrage de la tentative:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body; // [{question_id, selected_option_id, answer_text}]

    let correctCount = 0;
    let total = answers.length;

    for (let answer of answers) {
      const { question_id, selected_option_id, answer_text } = answer;

      // Vérifier la réponse
      let isCorrect = false;

      if (selected_option_id) {
        const [options] = await pool.query(
          'SELECT is_correct FROM options WHERE id = ?',
          [selected_option_id]
        );
        isCorrect = options.length > 0 && options[0].is_correct;
      }

      if (isCorrect) correctCount++;

      // Enregistrer la réponse
      await pool.query(
        'INSERT INTO quiz_answers (quiz_attempt_id, question_id, selected_option_id, answer_text, is_correct) VALUES (?, ?, ?, ?, ?)',
        [attemptId, question_id, selected_option_id, answer_text, isCorrect]
      );
    }

    const score = total > 0 ? (correctCount / total) * 100 : 0;

    // Mettre à jour la tentative
    await pool.query(
      'UPDATE quiz_attempts SET score = ?, completed_at = NOW() WHERE id = ?',
      [score, attemptId]
    );

    res.json({
      message: 'Quiz terminé',
      score,
      correctCount,
      total
    });
  } catch (error) {
    console.error('Erreur lors de la soumission des réponses:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
