const { pool } = require('../config/database');

// ============= CRÉER UN QUIZ (Formateur) =============
exports.createQuiz = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { moduleid, title, description, questions } = req.body;
    const trainer_id = req.user.id;
    
    // Vérifier que le module appartient au formateur
    const [modules] = await connection.execute(`
      SELECT m.id, c.created_by 
      FROM modules m
      JOIN courses c ON m.course_id = c.id
      WHERE m.id = ?
    `, [moduleid]);
    
    if (modules.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Module non trouvé' });
    }
    
    if (modules[0].created_by !== trainer_id) {
      await connection.rollback();
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    // Créer le quiz
    const [quizResult] = await connection.execute(
      'INSERT INTO quizzes (module_id, title, description) VALUES (?, ?, ?)',
      [moduleid, title, description]
    );
    
    const quizId = quizResult.insertId;
    
    // Ajouter les questions
    for (const question of questions) {
      const [questionResult] = await connection.execute(
        'INSERT INTO questions (quiz_id, question_text, type) VALUES (?, ?, ?)',
        [quizId, question.text, question.type || 'single_choice']
      );
      
      const questionId = questionResult.insertId;
      
      // Ajouter les options
      if (question.options && question.options.length > 0) {
        for (const option of question.options) {
          await connection.execute(
            'INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
            [questionId, option.text, option.isCorrect ? 1 : 0]
          );
        }
      }
    }
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Quiz créé avec succès',
      quizId: quizId
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Erreur création quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la création du quiz' });
  } finally {
    connection.release();
  }
};

// ============= RÉCUPÉRER UN QUIZ AVEC QUESTIONS =============
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [quizzes] = await pool.execute(
      'SELECT * FROM quizzes WHERE id = ?',
      [id]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz non trouvé' });
    }
    
    const quiz = quizzes[0];
    
    const [questions] = await pool.execute(`
      SELECT 
        q.id,
        q.question_text,
        q.type,
        o.id AS option_id,
        o.option_text,
        o.is_correct
      FROM questions q
      LEFT JOIN options o ON q.id = o.question_id
      WHERE q.quiz_id = ?
      ORDER BY q.id, o.id
    `, [id]);
    
    const questionsMap = {};
    questions.forEach(row => {
      if (!questionsMap[row.id]) {
        questionsMap[row.id] = {
          id: row.id,
          text: row.question_text,
          type: row.type,
          options: []
        };
      }
      
      if (row.option_id) {
        questionsMap[row.id].options.push({
          id: row.option_id,
          text: row.option_text
        });
      }
    });
    
    quiz.questions = Object.values(questionsMap);
    
    res.json(quiz);
    
  } catch (error) {
    console.error('Erreur récupération quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du quiz' });
  }
};

// ============= RÉCUPÉRER TOUS LES QUIZ D'UN MODULE =============
exports.getQuizzesByModule = async (req, res) => {
  try {
    const { moduleid } = req.params;
    
    const [quizzes] = await pool.execute(`
      SELECT 
        q.id,
        q.title,
        q.description,
        COUNT(DISTINCT qs.id) AS questions_count
      FROM quizzes q
      LEFT JOIN questions qs ON q.id = qs.quiz_id
      WHERE q.module_id = ?
      GROUP BY q.id
    `, [moduleid]);
    
    res.json(quizzes);
    
  } catch (error) {
    console.error('Erreur récupération quizzes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des quizzes' });
  }
};

// ============= DÉMARRER UNE TENTATIVE DE QUIZ =============
exports.startQuizAttempt = async (req, res) => {
  try {
    const { quizid } = req.body;
    const userid = req.user.id;
    
    const [enrollment] = await pool.execute(`
      SELECT e.id
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN modules m ON c.id = m.course_id
      JOIN quizzes q ON m.id = q.module_id
      WHERE e.user_id = ? AND q.id = ?
    `, [userid, quizid]);
    
    if (enrollment.length === 0) {
      return res.status(403).json({ error: 'Vous devez être inscrit au cours pour passer ce quiz' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO quiz_attempts (user_id, quiz_id, started_at) VALUES (?, ?, NOW())',
      [userid, quizid]
    );
    
    res.status(201).json({
      message: 'Tentative démarrée',
      attemptId: result.insertId
    });
    
  } catch (error) {
    console.error('Erreur démarrage tentative:', error);
    res.status(500).json({ error: 'Erreur lors du démarrage de la tentative' });
  }
};

// ============= SOUMETTRE LES RÉPONSES =============
exports.submitQuizAnswers = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { attemptid, answers } = req.body;
    const userid = req.user.id;
    
    const [attempts] = await connection.execute(
      'SELECT id, quiz_id FROM quiz_attempts WHERE id = ? AND user_id = ?',
      [attemptid, userid]
    );
    
    if (attempts.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Tentative non trouvée' });
    }
    
    let correctCount = 0;
    let totalCount = 0;
    
    for (const answer of answers) {
      const { questionid, selectedoptionid } = answer;
      
      const [options] = await connection.execute(
        'SELECT is_correct FROM options WHERE id = ?',
        [selectedoptionid]
      );
      
      const isCorrect = options.length > 0 && options[0].is_correct === 1;
      
      if (isCorrect) correctCount++;
      totalCount++;
      
      await connection.execute(
        `INSERT INTO quiz_answers 
        (quiz_attempt_id, question_id, selected_option_id, is_correct) 
        VALUES (?, ?, ?, ?)`,
        [attemptid, questionid, selectedoptionid, isCorrect ? 1 : 0]
      );
    }
    
    const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    
    await connection.execute(
      'UPDATE quiz_attempts SET score = ?, completed_at = NOW() WHERE id = ?',
      [score, attemptid]
    );
    
    await connection.commit();
    
    res.json({
      message: 'Quiz soumis avec succès',
      score: Math.round(score),
      correctCount,
      totalCount
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Erreur soumission quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la soumission du quiz' });
  } finally {
    connection.release();
  }
};

// ============= RÉCUPÉRER LES RÉSULTATS =============
exports.getQuizResults = async (req, res) => {
  try {
    const { attemptid } = req.params;
    const userid = req.user.id;
    
    const [attempts] = await pool.execute(`
      SELECT 
        qa.id,
        qa.score,
        qa.completed_at,
        q.title AS quiz_title
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.id = ? AND qa.user_id = ?
    `, [attemptid, userid]);
    
    if (attempts.length === 0) {
      return res.status(404).json({ error: 'Résultats non trouvés' });
    }
    
    const attempt = attempts[0];
    
    const [answers] = await pool.execute(`
      SELECT 
        qa.id,
        qa.is_correct,
        q.question_text,
        o.option_text AS selected_option,
        correct_o.option_text AS correct_option
      FROM quiz_answers qa
      JOIN questions q ON qa.question_id = q.id
      JOIN options o ON qa.selected_option_id = o.id
      LEFT JOIN options correct_o 
        ON correct_o.question_id = q.id AND correct_o.is_correct = 1
      WHERE qa.quiz_attempt_id = ?
    `, [attemptid]);
    
    attempt.answers = answers;
    
    res.json(attempt);
    
  } catch (error) {
    console.error('Erreur récupération résultats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des résultats' });
  }
};

// ============= METTRE À JOUR UN QUIZ =============
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const trainer_id = req.user.id;
    
    const [quizzes] = await pool.execute(`
      SELECT q.id
      FROM quizzes q
      JOIN modules m ON q.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE q.id = ? AND c.created_by = ?
    `, [id, trainer_id]);
    
    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz non trouvé ou accès refusé' });
    }
    
    await pool.execute(
      'UPDATE quizzes SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );
    
    res.json({ message: 'Quiz mis à jour avec succès' });
    
  } catch (error) {
    console.error('Erreur mise à jour quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du quiz' });
  }
};

// ============= SUPPRIMER UN QUIZ =============
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer_id = req.user.id;
    
    const [quizzes] = await pool.execute(`
      SELECT q.id
      FROM quizzes q
      JOIN modules m ON q.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE q.id = ? AND c.created_by = ?
    `, [id, trainer_id]);
    
    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz non trouvé ou accès refusé' });
    }
    
    await pool.execute('DELETE FROM quizzes WHERE id = ?', [id]);
    
    res.json({ message: 'Quiz supprimé avec succès' });
    
  } catch (error) {
    console.error('Erreur suppression quiz:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du quiz' });
  }
};
