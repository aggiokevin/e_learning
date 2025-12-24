const { pool } = require('../config/database');

exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, u.name as creator_name,
      (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollments_count
      FROM courses c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.is_published = TRUE
    `;
    const params = [];

    if (category) {
      query += ' AND c.category = ?';
      params.push(category);
    }

    if (level) {
      query += ' AND c.level = ?';
      params.push(level);
    }

    if (search) {
      query += ' AND (c.title LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [courses] = await pool.query(query, params);

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM courses WHERE is_published = TRUE';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (level) {
      countQuery += ' AND level = ?';
      countParams.push(level);
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const [courses] = await pool.query(`
      SELECT c.*, u.name as creator_name,
      (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollments_count
      FROM courses c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.id = ?
    `, [id]);

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    // Récupérer les modules
    const [modules] = await pool.query(`
      SELECT * FROM modules WHERE course_id = ? ORDER BY order_index
    `, [id]);

    // Pour chaque module, récupérer les leçons
    for (let module of modules) {
      const [lessons] = await pool.query(`
        SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index
      `, [module.id]);
      module.lessons = lessons;
    }

    const course = courses[0];
    course.modules = modules;

    res.json({ course });
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, level, category, thumbnail_url } = req.body;

    const [result] = await pool.query(`
      INSERT INTO courses (title, description, level, category, thumbnail_url, created_by, is_published)
      VALUES (?, ?, ?, ?, ?, ?, FALSE)
    `, [title, description, level, category, thumbnail_url, req.user.id]);

    res.status(201).json({
      message: 'Cours créé avec succès',
      courseId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, level, category, thumbnail_url, is_published } = req.body;

    // Vérifier que l'utilisateur est le créateur ou un admin
    const [courses] = await pool.query('SELECT created_by FROM courses WHERE id = ?', [id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    if (courses[0].created_by !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await pool.query(`
      UPDATE courses 
      SET title = ?, description = ?, level = ?, category = ?, thumbnail_url = ?, is_published = ?
      WHERE id = ?
    `, [title, description, level, category, thumbnail_url, is_published, id]);

    res.json({ message: 'Cours mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM courses WHERE id = ?', [id]);

    res.json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order_index } = req.body;

    const [result] = await pool.query(`
      INSERT INTO modules (course_id, title, description, order_index)
      VALUES (?, ?, ?, ?)
    `, [courseId, title, description, order_index]);

    res.status(201).json({
      message: 'Module créé avec succès',
      moduleId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la création du module:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, content_type, content_url_or_text, order_index, estimated_duration_minutes } = req.body;

    const [result] = await pool.query(`
      INSERT INTO lessons (module_id, title, content_type, content_url_or_text, order_index, estimated_duration_minutes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [moduleId, title, content_type, content_url_or_text, order_index, estimated_duration_minutes]);

    res.status(201).json({
      message: 'Leçon créée avec succès',
      lessonId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la création de la leçon:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
