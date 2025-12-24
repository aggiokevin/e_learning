// backend/routes/chatbot.js
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Route pour envoyer un message au chatbot
router.post('/message', chatbotController.sendMessage);

module.exports = router;
