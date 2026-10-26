const { pool } = require('../config/database');
const fs = require('fs');        // ← AJOUTER CETTE LIGNE
const path = require('path');    // ← AJOUTER CETTE LIGNE

exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    console.log(req.query);
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, u.name as creator_name,
      (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollments_count,
      (SELECT COUNT(*) FROM modules WHERE course_id = c.id) as modules,
      (SELECT estimated_duration_minutes FROM lessons WHERE module_id IN 
        (SELECT id FROM modules WHERE course_id = c.id)
        ORDER BY estimated_duration_minutes DESC LIMIT 1) as estimated_duration_minutes
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
    // DÉBOGAGE : Voir ce qui est reçu
    console.log('📦 req.body:', req.body);
    console.log('📸 req.file:', req.file);
    console.log('👤 req.user:', req.user);
    
    const { title, description, category, level } = req.body;
    const trainer_id = req.user.id;
    
    // Vérifier qu'un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({ error: 'Image du cours requise' });
    }
    
    // Vérifier que tous les champs sont présents
    if (!title || !description || !category || !level) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis',
        received: { title, description, category, level }
      });
    }
    
    // Vérifier trainer_id
    if (!trainer_id) {
      return res.status(400).json({ error: 'Utilisateur non authentifié' });
    }
    
    // Chemin relatif de l'image
    const image_url = `/uploads/courses/${req.file.filename}`;
    
    console.log('✅ Données à insérer:', {
      title,
      description,
      category,
      level,
      image_url,
      trainer_id
    });
    
    const [result] = await pool.execute(
      `INSERT INTO courses (title, description, category, level, image_url, created_by, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [title, description, category, level, image_url, trainer_id]
    );
    
    res.status(201).json({
      message: 'Cours créé avec succès',
      courseId: result.insertId,
      image_url: image_url
    });
  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Erreur création cours:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du cours',
      details: error.message 
    });
  }
};


// Fonction pour mettre à jour un cours (MODIFIÉE)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, level, duration } = req.body;
    
    // Récupérer l'ancienne image
    const [courses] = await pool.execute(
      'SELECT image_url FROM courses WHERE course_id = ?',
      [id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    let image_url = courses[0].image_url;
    
    // Si un nouveau fichier est uploadé
    if (req.file) {
      image_url = `/uploads/courses/${req.file.filename}`;
      
      // Supprimer l'ancienne image
      const oldImagePath = path.join(__dirname, '..', courses[0].image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    await pool.execute(
      `UPDATE courses 
       SET title = ?, description = ?, category = ?, level = ?, duration = ?, image_url = ?
       WHERE course_id = ?`,
      [title, description, category, level, duration, image_url, id]
    );
    
    res.json({ 
      message: 'Cours mis à jour avec succès',
      image_url: image_url
    });
  } catch (error) {
    console.error('Erreur mise à jour cours:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du cours' });
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


// ============= ADMIN : CHANGER LE STATUT DE PUBLICATION =============
exports.togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le statut actuel
    const [courses] = await pool.execute(
      'SELECT is_published FROM courses WHERE id = ?',
      [id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    const newStatus = courses[0].is_published === 1 ? 0 : 1;
    
    await pool.execute(
      'UPDATE courses SET is_published = ?, updated_at = NOW() WHERE id = ?',
      [newStatus, id]
    );
    
    res.json({
      message: newStatus === 1 ? 'Cours publié' : 'Cours dépublié',
      ispublished: newStatus
    });
  } catch (error) {
    console.error('Erreur changement statut:', error);
    res.status(500).json({ error: 'Erreur lors du changement de statut' });
  }
};

// ============= ADMIN : SUPPRIMER UN COURS =============
exports.deleteCourseAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer l'image avant suppression
    const [courses] = await pool.execute(
      'SELECT image_url FROM courses WHERE id = ?',
      [id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    // Supprimer l'image du disque
    if (courses[0].imageurl) {
      const imagePath = path.join(__dirname, '..', courses[0].imageurl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Supprimer le cours (les FK CASCADE supprimeront les modules, leçons, etc.)
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    
    res.json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression cours:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du cours' });
  }
};

// ============= ADMIN : STATISTIQUES PAR COURS =============
exports.getCourseStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [stats] = await pool.execute(`
      SELECT 
        c.id,
        c.title,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT m.id) as total_modules,
        COUNT(DISTINCT l.id) as total_lessons,
        AVG(e.finalscore) as average_score,
        SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN lessons l ON m.id = l.module_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);
    
    if (stats.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Erreur récupération stats cours:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

// ============= ADMIN : RÉCUPÉRER TOUS LES COURS =============
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const { category, level, is_published, search } = req.query;
    console.log('Admin course filters:', is_published);
    
    let query = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.category,
        c.level,
        c.image_url,
        c.is_published,
        c.created_at,
        c.updated_at,
        u.name as trainer_name,
        u.email as trainer_email,
        COUNT(DISTINCT e.id) as enrollments_count,
        COUNT(DISTINCT m.id) as modules_count
      FROM courses c
      LEFT JOIN users u ON c.created_by = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN modules m ON c.id = m.course_id
      WHERE 1=1
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
    
    if (is_published !== undefined && is_published !== '') {
      query += ' AND c.is_published = ?';
      params.push(parseInt(is_published));
    }
    
    if (search) {
      query += ' AND (c.title LIKE ? OR c.description LIKE ? OR u.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ' GROUP BY c.id ORDER BY c.created_at DESC';
    
    const [courses] = await pool.execute(query, params);
    // console.log('Courses retrieved for admin:', courses);
    res.json({
      courses,
      total: courses.length
    });
  } catch (error) {
    console.error('Erreur récupération cours admin:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
  }
};

// ============= ADMIN : CHANGER LE STATUT DE PUBLICATION =============
exports.togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le statut actuel
    const [courses] = await pool.execute(
      'SELECT is_published FROM courses WHERE id = ?',
      [id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    const newStatus = courses[0].is_published === 1 ? 0 : 1;
    
    await pool.execute(
      'UPDATE courses SET is_published = ?, updated_at = NOW() WHERE id = ?',
      [newStatus, id]
    );
    
    res.json({
      message: newStatus === 1 ? 'Cours publié' : 'Cours dépublié',
      ispublished: newStatus
    });
  } catch (error) {
    console.error('Erreur changement statut:', error);
    res.status(500).json({ error: 'Erreur lors du changement de statut' });
  }
};

// ============= ADMIN : SUPPRIMER UN COURS =============
exports.deleteCourseAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer l'image avant suppression
    const [courses] = await pool.execute(
      'SELECT image_url FROM courses WHERE id = ?',
      [id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    // Supprimer l'image du disque
    if (courses[0].imageurl) {
      const imagePath = path.join(__dirname, '..', courses[0].imageurl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Supprimer le cours (les FK CASCADE supprimeront les modules, leçons, etc.)
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    
    res.json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression cours:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du cours' });
  }
};

// ============= ADMIN : STATISTIQUES PAR COURS =============
exports.getCourseStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [stats] = await pool.execute(`
      SELECT 
        c.id,
        c.title,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT m.id) as total_modules,
        COUNT(DISTINCT l.id) as total_lessons,
        AVG(e.finalscore) as average_score,
        SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN lessons l ON m.id = l.moduleid
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);
    
    if (stats.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Erreur récupération stats cours:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};