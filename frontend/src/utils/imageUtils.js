/**
 * Obtenir l'URL complète d'une image uploadée
 * @param {string} imagePath - Chemin de l'image (ex: /uploads/courses/course-123.jpg)
 * @returns {string} URL complète de l'image
 */
export const getImageUrl = (imagePath) => {
  // Si pas d'image, retourner le placeholder
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300?text=Formation';
  }
  
  // Si c'est déjà une URL complète, la retourner
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construire l'URL complète
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseURL = API_URL.replace('/api', ''); // http://localhost:5000
  
  // S'assurer que le path commence par /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseURL}${cleanPath}`;
};

/**
 * Gestionnaire d'erreur de chargement d'image
 * @param {Event} e - Event de l'image
 */
export const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x300?text=Formation';
  e.target.onerror = null; // Éviter une boucle infinie
};
