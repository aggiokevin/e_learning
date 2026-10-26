// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../config/database');
const roleCheck = require('../middleware/roleCheck');

// Récupérer un cours spécifique avec tous ses détails
router.get('/:id', auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Récupérer le cours
    const [courses] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.level,
        c.category,
        c.thumbnail_url,
        c.created_by,
        c.is_published,
        c.created_at,
        c.updated_at,
        u.name as creator_name
      FROM courses c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.id = ?
    `, [courseId]);

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const course = courses[0];

    // Vérifier les permissions
    // TRAINEE : seulement les cours publiés
    // TRAINER : ses propres cours ou cours publiés
    // ADMIN : tous les cours
    if (userRole === 'TRAINEE' && !course.is_published) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    if (userRole === 'TRAINER' && !course.is_published && course.created_by !== userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Récupérer les modules et leçons
    const [modules] = await pool.query(`
      SELECT 
        m.id,
        m.title,
        m.description,
        m.order_index
      FROM modules m
      WHERE m.course_id = ?
      ORDER BY m.order_index
    `, [courseId]);

    // Pour chaque module, récupérer ses leçons
    for (let module of modules) {
      const [lessons] = await pool.query(`
        SELECT 
          l.id,
          l.title,
          l.content_type,
          l.content_url_or_text,
          l.order_index,
          l.estimated_duration_minutes
        FROM lessons l
        WHERE l.module_id = ?
        ORDER BY l.order_index
      `, [module.id]);
      
      module.lessons = lessons;
    }

    course.modules = modules;

    // Statistiques pour le cours
    const [stats] = await pool.query(`
      SELECT 
        COUNT(DISTINCT e.id) as enrollment_count,
        COUNT(DISTINCT m.id) as module_count,
        COUNT(DISTINCT l.id) as lesson_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN lessons l ON m.id = l.module_id
      WHERE c.id = ?
    `, [courseId]);

    course.stats = stats[0];

    res.json(course);

  } catch (error) {
    console.error('Erreur récupération cours:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Publier un cours
router.patch('/:id/publish', auth, roleCheck('TRAINER', 'ADMIN'), async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Vérifier que le cours appartient au formateur (sauf si ADMIN)
    if (req.user.role !== 'ADMIN') {
      const [courses] = await pool.query(
        'SELECT id FROM courses WHERE id = ? AND created_by = ?',
        [courseId, userId]
      );

      if (courses.length === 0) {
        return res.status(403).json({ 
          message: 'Vous ne pouvez publier que vos propres cours' 
        });
      }
    }

    // Vérifications avant publication
    const [courseDetails] = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        COUNT(DISTINCT m.id) as module_count,
        COUNT(DISTINCT l.id) as lesson_count
      FROM courses c
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN lessons l ON m.id = l.module_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [courseId]);

    if (courseDetails.length === 0) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const course = courseDetails[0];

    // Validation
    if (!course.title || !course.description) {
      return res.status(400).json({ 
        message: 'Le cours doit avoir un titre et une description' 
      });
    }

    if (course.module_count === 0) {
      return res.status(400).json({ 
        message: 'Le cours doit contenir au moins un module' 
      });
    }

    if (course.lesson_count === 0) {
      return res.status(400).json({ 
        message: 'Le cours doit contenir au moins une leçon' 
      });
    }

    // Publier le cours
    await pool.query(
      'UPDATE courses SET is_published = TRUE, updated_at = NOW() WHERE id = ?',
      [courseId]
    );

    res.json({ 
      message: 'Cours publié avec succès',
      courseId 
    });

  } catch (error) {
    console.error('Erreur publication cours:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Dépublier un cours
router.patch('/:id/unpublish', auth, roleCheck('TRAINER', 'ADMIN'), async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    if (req.user.role !== 'ADMIN') {
      const [courses] = await pool.query(
        'SELECT id FROM courses WHERE id = ? AND created_by = ?',
        [courseId, userId]
      );

      if (courses.length === 0) {
        return res.status(403).json({ 
          message: 'Vous ne pouvez dépublier que vos propres cours' 
        });
      }
    }

    await pool.query(
      'UPDATE courses SET is_published = FALSE, updated_at = NOW() WHERE id = ?',
      [courseId]
    );

    res.json({ 
      message: 'Cours dépublié avec succès',
      courseId 
    });

  } catch (error) {
    console.error('Erreur dépublication cours:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
