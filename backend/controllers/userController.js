const { pool } = require('../config/database');

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [users] = await pool.query(
      'SELECT id, name, email, role, is_active, created_at FROM users LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;

    await pool.query(
      'UPDATE users SET role = ?, is_active = ? WHERE id = ?',
      [role, is_active, id]
    );

    res.json({ message: 'Utilisateur mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
