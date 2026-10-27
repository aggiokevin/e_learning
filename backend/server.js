const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const progressRoutes = require('./routes/progress');
// const quizRoutes = require('./routes/quiz');
const chatbotRoutes = require('./routes/chatbot');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const publishRoutes = require('./routes/course');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (IMPORTANT)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api', progressRoutes);
// app.use('/api', quizRoutes);
// Ajouter cette ligne avec les autres routes
app.use('/api/quizzes', require('./routes/quiz'));
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', publishRoutes);
app.use('/api/analytics', require('./routes/analytics'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API FormaPro en ligne' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
}

startServer();
