const { pool } = require('../config/database');

exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Vérifier si déjà inscrit
    const [existing] = await pool.query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Déjà inscrit à ce cours' });
    }

    await pool.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [userId, courseId]
    );

    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const [courses] = await pool.query(`
      SELECT c.*, e.enrollment_date, e.status, e.final_score,
      (SELECT COUNT(*) FROM lessons l 
       JOIN modules m ON l.module_id = m.id 
       WHERE m.course_id = c.id) as total_lessons,
      (SELECT COUNT(*) FROM progress p
       JOIN lessons l ON p.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = c.id AND p.user_id = ? AND p.status = 'completed') as completed_lessons
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.user_id = ?
    `, [userId, userId]);

    // Calculer le pourcentage de progression
    courses.forEach(course => {
      course.progress_percentage = course.total_lessons > 0 
        ? Math.round((course.completed_lessons / course.total_lessons) * 100)
        : 0;
    });

    res.json({ courses });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Vérifier l'inscription
    const [enrollment] = await pool.query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollment.length === 0) {
      return res.status(404).json({ error: 'Non inscrit à ce cours' });
    }

    // Récupérer la progression détaillée
    const [modules] = await pool.query(`
      SELECT m.*, 
      (SELECT COUNT(*) FROM lessons WHERE module_id = m.id) as total_lessons,
      (SELECT COUNT(*) FROM lessons l
       JOIN progress p ON l.id = p.lesson_id
       WHERE l.module_id = m.id AND p.user_id = ? AND p.status = 'completed') as completed_lessons
      FROM modules m
      WHERE m.course_id = ?
      ORDER BY m.order_index
    `, [userId, courseId]);

    for (let module of modules) {
      const [lessons] = await pool.query(`
        SELECT l.*, 
        COALESCE(p.status, 'not_started') as progress_status
        FROM lessons l
        LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
        WHERE l.module_id = ?
        ORDER BY l.order_index
      `, [userId, module.id]);
      
      module.lessons = lessons;
    }

    res.json({
      enrollment: enrollment[0],
      modules
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la progression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
