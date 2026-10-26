const { pool } = require('../config/database');

// ============= STATISTIQUES GLOBALES =============
exports.getGlobalStats = async (req, res) => {
  try {
    // Total des utilisateurs
    const [usersStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'TRAINEE' THEN 1 ELSE 0 END) as total_trainees,
        SUM(CASE WHEN role = 'TRAINER' THEN 1 ELSE 0 END) as total_trainers,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as new_users_today
      FROM users
    `);

    // Total des cours
    const [coursesStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_courses,
        SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published_courses,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as new_courses_today
      FROM courses
    `);

    res.json({
      users: usersStats[0],
      courses: coursesStats[0],
      enrollments: { total_enrollments: 0, new_enrollments_today: 0, average_progress: 0 },
      quiz: { total_attempts: 0, average_score: 0 }
    });
  } catch (error) {
    console.error('Erreur récupération stats globales:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

// ============= STATISTIQUES PAR PÉRIODE =============
exports.getStatsByPeriod = async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let interval = '7 DAY';
    if (period === '30days') interval = '30 DAY';
    if (period === '6months') interval = '6 MONTH';
    if (period === '1year') interval = '1 YEAR';

    const [newUsers] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ${interval})
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    res.json({ newUsers, newEnrollments: [], newCourses: [] });
  } catch (error) {
    console.error('Erreur récupération stats par période:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

// ============= TOP COURS =============
exports.getTopCourses = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const [topCourses] = await pool.execute(`
      SELECT 
        c.id,
        c.title,
        c.category,
        c.image_url,
        0 as enrollments_count,
        0 as average_progress
      FROM courses c
      WHERE c.is_published = 1
      ORDER BY c.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json(topCourses);
  } catch (error) {
    console.error('Erreur récupération top cours:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des top cours' });
  }
};

// ============= RÉPARTITION PAR CATÉGORIE =============
exports.getCategoryDistribution = async (req, res) => {
  try {
    const [distribution] = await pool.execute(`
      SELECT 
        c.category,
        COUNT(c.id) as courses_count,
        COUNT(c.id) as enrollments_count
      FROM courses c
      WHERE c.is_published = 1
      GROUP BY c.category
      ORDER BY courses_count DESC
    `);

    res.json(distribution);
  } catch (error) {
    console.error('Erreur récupération distribution catégories:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la distribution' });
  }
};

// ============= TOP FORMATEURS =============
exports.getTopTrainers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const [topTrainers] = await pool.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(c.id) as courses_count,
        0 as total_enrollments,
        0 as average_student_progress
      FROM users u
      LEFT JOIN courses c ON u.id = c.created_by
      WHERE u.role = 'TRAINER'
      GROUP BY u.id
      ORDER BY courses_count DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json(topTrainers);
  } catch (error) {
    console.error('Erreur récupération top formateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des top formateurs' });
  }
};

// ============= TAUX DE COMPLÉTION =============
exports.getCompletionRates = async (req, res) => {
  try {
    const [rates] = await pool.execute(`
      SELECT 
        c.id,
        c.title,
        0 as total_students,
        0 as completed_students,
        0 as completion_rate
      FROM courses c
      WHERE c.is_published = 1
      ORDER BY c.created_at DESC
      LIMIT 10
    `);

    res.json(rates);
  } catch (error) {
    console.error('Erreur récupération taux de complétion:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des taux de complétion' });
  }
};

// ============= ACTIVITÉ RÉCENTE =============
exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const [activities] = await pool.execute(`
      SELECT 
        'course_created' as type,
        c.created_at as date,
        u.name,
        c.title as course_title
      FROM courses c
      JOIN users u ON c.created_by = u.id
      ORDER BY c.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json(activities);
  } catch (error) {
    console.error('Erreur récupération activité récente:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'activité récente' });
  }
};
