// backend/controllers/chatbotController.js
const { pool } = require('../config/database');

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';

    // FORMATIONS DISPONIBLES
    if (lowerMessage.includes('formation') || 
        lowerMessage.includes('cours') || 
        lowerMessage.includes('liste')) {
      
      try {
        const [courses] = await pool.query(`
          SELECT c.id, c.title, c.description, c.level, c.category,
                 u.name as trainer_name,
                 COUNT(DISTINCT e.id) as enrolled_count
          FROM courses c
          LEFT JOIN users u ON c.created_by = u.id
          LEFT JOIN enrollments e ON c.id = e.course_id
          WHERE c.is_published = TRUE
          GROUP BY c.id
          ORDER BY c.created_at DESC
          LIMIT 10
        `);

        if (courses.length === 0) {
          response = "📚 Aucune formation n'est disponible actuellement.\n\nRevenez bientôt pour découvrir nos nouveaux cours !";
        } else {
          response = `📚 **Formations disponibles sur FormaPro :**\n\n`;
          courses.forEach((course, index) => {
            response += `**${index + 1}. ${course.title}**\n`;
            response += `   📊 Niveau : ${course.level}\n`;
            if (course.category) {
              response += `   🏷️ Catégorie : ${course.category}\n`;
            }
            if (course.trainer_name) {
              response += `   👨‍🏫 Formateur : ${course.trainer_name}\n`;
            }
            response += `   👥 ${course.enrolled_count} inscrits\n`;
            if (course.description) {
              const desc = course.description.substring(0, 80);
              response += `   📝 ${desc}${course.description.length > 80 ? '...' : ''}\n`;
            }
            response += `\n`;
          });
          response += `✨ Pour vous inscrire, consultez notre catalogue de formations !`;
        }
      } catch (dbError) {
        console.error('DB Error:', dbError);
        response = getFormationsResponseFallback();
      }
    }

    // RECHERCHE PAR CATÉGORIE
    else if (lowerMessage.includes('développement') || 
             lowerMessage.includes('web') || 
             lowerMessage.includes('programmation')) {
      
      try {
        const [courses] = await pool.query(`
          SELECT title, description, level
          FROM courses
          WHERE is_published = TRUE 
          AND (title LIKE '%développement%' OR title LIKE '%web%' OR category LIKE '%développement%')
          LIMIT 5
        `);

        if (courses.length > 0) {
          response = `💻 **Formations en Développement Web :**\n\n`;
          courses.forEach((course, i) => {
            response += `${i + 1}. **${course.title}** (${course.level})\n`;
            if (course.description) {
              response += `   ${course.description.substring(0, 60)}...\n`;
            }
            response += `\n`;
          });
        } else {
          response = "Nous n'avons pas encore de formations en développement web, mais nous en ajoutons régulièrement ! 🚀";
        }
      } catch (dbError) {
        console.error('DB Error:', dbError);
        response = "💻 Consultez notre catalogue pour découvrir nos formations en développement !";
      }
    }

    // CONSEILS CV
    else if (lowerMessage.includes('cv') || lowerMessage.includes('curriculum')) {
      response = `📄 **Conseils pour un CV efficace :**

✅ **Structure claire**
   • Coordonnées complètes
   • Expériences (du plus récent au plus ancien)
   • Formations et diplômes
   • Compétences clés

✅ **Contenu percutant**
   • Maximum 2 pages
   • Verbes d'action (gérer, créer, développer...)
   • Résultats chiffrés (ex: "Augmenté les ventes de 25%")
   • Adapté au poste visé

❌ **À éviter**
   • Fautes d'orthographe
   • Informations non pertinentes
   • Mensonges sur vos compétences

💡 Consultez nos formations "Insertion Professionnelle" pour un accompagnement personnalisé !`;
    }

    // ENTRETIENS
    else if (lowerMessage.includes('entretien') || 
             lowerMessage.includes('entrevue') || 
             lowerMessage.includes('interview')) {
      response = `💼 **Réussir votre entretien d'embauche :**

**Avant l'entretien :**
🔍 Renseignez-vous sur l'entreprise
📋 Préparez des exemples concrets
❓ Préparez vos questions

**Pendant l'entretien :**
⏰ Arrivez 10 min en avance
👔 Soignez votre présentation
🤝 Soyez confiant et souriant
📱 Téléphone en mode avion

**Questions fréquentes :**
• "Parlez-moi de vous"
• "Pourquoi ce poste ?"
• "Vos points forts/faibles ?"
• "Où vous voyez-vous dans 5 ans ?"

✨ Participez à nos ateliers pratiques !`;
    }

    // INSCRIPTION
    else if (lowerMessage.includes('inscri') || 
             lowerMessage.includes('compte') || 
             lowerMessage.includes('créer')) {
      response = `🎓 **Créer votre compte FormaPro :**

**Étapes :**
1. Cliquez sur "S'inscrire"
2. Choisissez votre rôle :
   • **TRAINEE** 📚 : Suivre des formations
   • **TRAINER** 👨‍🏫 : Créer des cours
   • **ADMIN** ⚙️ : Gérer la plateforme

3. Remplissez vos informations
4. Validez votre email
5. Explorez nos formations !

🆓 **L'inscription est gratuite !**`;
    }

    // PRIX / TARIFS
    else if (lowerMessage.includes('prix') || 
             lowerMessage.includes('tarif') || 
             lowerMessage.includes('coût') ||
             lowerMessage.includes('payant')) {
      response = `💰 **Tarification FormaPro :**

🎁 **La plupart de nos formations sont GRATUITES !**

**Formations Premium :**
• 🏆 Certificat officiel
• 👨‍🏫 Suivi personnalisé
• 💼 Projets encadrés
• ♾️ Accès à vie

**Tarifs :** À partir de 5,000 FCFA

💡 Consultez chaque formation pour voir son tarif.
🎓 Bourses disponibles pour les étudiants !`;
    }

    // CERTIFICAT
    else if (lowerMessage.includes('certificat') || 
             lowerMessage.includes('diplôme') || 
             lowerMessage.includes('attestation')) {
      response = `🏆 **Certificats FormaPro :**

**Ce que vous recevez :**
✅ Certificat numérique
✅ Document PDF téléchargeable
✅ Badge LinkedIn
✅ Code de vérification unique

**Conditions :**
• Compléter 100% des modules
• Réussir les quiz (minimum 70%)
• Soumettre les projets

💼 Nos certificats sont reconnus par de nombreuses entreprises !`;
    }

    // CONTACT / AIDE
    else if (lowerMessage.includes('contact') || 
             lowerMessage.includes('aide') || 
             lowerMessage.includes('support') ||
             lowerMessage.includes('problème')) {
      response = `📞 **Besoin d'aide ?**

📧 **Email :** support@formapro.com
💬 **Chat :** Lun-Ven, 9h-18h EAT
📱 **Téléphone :** +243 XXX XXX XXX

🤖 **Je peux vous aider avec :**
• Les formations
• Les inscriptions
• CV et entretiens
• Les certificats
• Les tarifs

Que puis-je faire pour vous ? 😊`;
    }

    // MES COURS (si authentifié)
    else if (lowerMessage.includes('mes cours') || 
             lowerMessage.includes('ma progression') ||
             lowerMessage.includes('mes formations')) {
      
      if (req.user && req.user.id) {
        try {
          const [enrollments] = await pool.query(`
            SELECT c.title, e.status, e.final_score, e.enrollment_date
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ?
            ORDER BY e.enrollment_date DESC
          `, [req.user.id]);

          if (enrollments.length > 0) {
            response = `📊 **Vos formations :**\n\n`;
            enrollments.forEach((enroll, i) => {
              response += `${i + 1}. **${enroll.title}**\n`;
              response += `   📈 Statut : ${enroll.status === 'completed' ? '✅ Complété' : '📚 En cours'}\n`;
              if (enroll.final_score > 0) {
                response += `   🎯 Score : ${enroll.final_score}%\n`;
              }
              response += `   📅 Inscrit le : ${new Date(enroll.enrollment_date).toLocaleDateString('fr-FR')}\n\n`;
            });
          } else {
            response = "Vous n'êtes inscrit à aucune formation.\n\nExplorez notre catalogue pour commencer ! 🚀";
          }
        } catch (dbError) {
          console.error('DB Error:', dbError);
          response = "Erreur lors de la récupération de vos formations. Veuillez réessayer.";
        }
      } else {
        response = "🔐 Connectez-vous pour voir vos formations !\n\nVous pourrez suivre votre progression et accéder à vos certificats.";
      }
    }

    // STATISTIQUES GÉNÉRALES
    else if (lowerMessage.includes('statistique') || 
             lowerMessage.includes('nombre') ||
             lowerMessage.includes('combien')) {
      
      try {
        const [stats] = await pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM courses WHERE is_published = TRUE) as total_courses,
            (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as total_users,
            (SELECT COUNT(*) FROM enrollments) as total_enrollments
        `);

        const stat = stats[0];
        response = `📊 **Statistiques FormaPro :**

📚 **${stat.total_courses}** formations disponibles
👥 **${stat.total_users}** utilisateurs actifs
🎓 **${stat.total_enrollments}** inscriptions totales

Rejoignez notre communauté d'apprenants ! 🚀`;
      } catch (dbError) {
        console.error('DB Error:', dbError);
        response = "📊 FormaPro compte des milliers d'apprenants et des dizaines de formations !";
      }
    }

    // SALUTATIONS
    else if (lowerMessage.includes('bonjour') || 
             lowerMessage.includes('salut') || 
             lowerMessage.includes('hello') ||
             lowerMessage.includes('bonsoir')) {
      response = `👋 Bonjour ! Je suis votre assistant FormaPro.

**Je peux vous aider avec :**
📚 Les formations disponibles
📝 Conseils CV
💼 Préparation entretiens
🎓 Inscriptions
🏆 Certificats
💰 Tarifs
📞 Support

Comment puis-je vous aider ? 😊`;
    }

    // MERCI
    else if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
      response = `De rien ! 😊

N'hésitez pas si vous avez d'autres questions.
**Bonne réussite !** 🚀`;
    }

    // AU REVOIR
    else if (lowerMessage.includes('au revoir') || 
             lowerMessage.includes('bye') || 
             lowerMessage.includes('à bientôt')) {
      response = `👋 Au revoir et à bientôt !

Continuez à apprendre ! 🌟`;
    }

    // DÉFAUT
    else {
      response = `Je n'ai pas bien compris. 🤔

**Je peux vous aider avec :**
📚 Liste des formations
📝 Conseils CV
💼 Préparation entretiens
🎓 Inscriptions
🏆 Certificats
💰 Tarifs

**Exemples :**
• "Quelles formations sont disponibles ?"
• "Comment rédiger un bon CV ?"
• "Combien coûte une formation ?"

Posez-moi une question ! 😊`;
    }

    res.json({ response });

  } catch (error) {
    console.error('Erreur chatbot:', error);
    res.status(500).json({ 
      error: 'Erreur lors du traitement du message',
      details: error.message
    });
  }
};

// Fonction helper pour réponse formations par défaut
function getFormationsResponseFallback() {
  return `📚 **Formations FormaPro :**

**1. 💻 Développement Web**
   📊 HTML, CSS, JavaScript, React
   ⏱️ 3-6 mois | Tous niveaux

**2. 📊 Data Science**
   📊 Python, Machine Learning
   ⏱️ 4-8 mois | Intermédiaire

**3. 📱 Marketing Digital**
   📊 SEO, Réseaux sociaux
   ⏱️ 2-4 mois | Débutant

**4. 📋 Gestion de Projet**
   📊 Agile, Scrum
   ⏱️ 1-3 mois | Tous niveaux

Consultez notre catalogue pour plus de détails ! 🎓`;
}
