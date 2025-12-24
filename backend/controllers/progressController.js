const { pool } = require('../config/database');

exports.updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Vérifier si la progression existe
    const [existing] = await pool.query(
      'SELECT id FROM progress WHERE user_id = ? AND lesson_id = ?',
      [userId, lessonId]
    );

    if (existing.length > 0) {
      // Mettre à jour
      await pool.query(
        'UPDATE progress SET status = ? WHERE user_id = ? AND lesson_id = ?',
        [status, userId, lessonId]
      );
    } else {
      // Créer
      await pool.query(
        'INSERT INTO progress (user_id, lesson_id, status) VALUES (?, ?, ?)',
        [userId, lessonId, status]
      );
    }

    res.json({ message: 'Progression mise à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la progression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
