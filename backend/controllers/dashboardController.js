const { pool } = require('../config/database');

exports.getTrainerDashboard = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // Récupérer les cours du formateur
    const [courses] = await pool.query(`
      SELECT c.id, c.title,
      (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollments_count,
      (SELECT AVG(final_score) FROM enrollments WHERE course_id = c.id AND status = 'completed') as avg_score
      FROM courses c
      WHERE c.created_by = ?
    `, [trainerId]);

    for (let course of courses) {
      // Taux de complétion
      const [stats] = await pool.query(`
        SELECT 
        COUNT(*) as total_enrolled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM enrollments
        WHERE course_id = ?
      `, [course.id]);

      course.completion_rate = stats[0].total_enrolled > 0 
        ? (stats[0].completed / stats[0].total_enrolled) * 100
        : 0;
    }

    res.json({ courses });
  } catch (error) {
    console.error('Erreur dashboard formateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    // Statistiques globales
    const [userStats] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active FROM users'
    );

    const [courseStats] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN is_published = TRUE THEN 1 ELSE 0 END) as published FROM courses'
    );

    const [enrollmentStats] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed FROM enrollments'
    );

    const completionRate = enrollmentStats[0].total > 0 
      ? (enrollmentStats[0].completed / enrollmentStats[0].total) * 100
      : 0;

    res.json({
      users: userStats[0],
      courses: courseStats[0],
      enrollments: enrollmentStats[0],
      completionRate
    });
  } catch (error) {
    console.error('Erreur dashboard admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
