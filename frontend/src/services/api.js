import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token ET gérer FormData
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // MODIFICATION IMPORTANTE : Détecter FormData
  // Si c'est un FormData, supprimer Content-Type pour laisser
  // le navigateur définir multipart/form-data avec boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Courses
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getPublished: (params) => api.get('/courses/published', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  
  // Ces méthodes gèrent maintenant à la fois JSON et FormData
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  
  delete: (id) => api.delete(`/courses/${id}`),
  createModule: (courseId, data) => api.post(`/courses/${courseId}/modules`, data),
  createLesson: (moduleId, data) => api.post(`/courses/modules/${moduleId}/lessons`, data),
// Routes admin
  getAllAdmin: (params) => api.get('/courses/admin/all', { params }),
  togglePublish: (id) => api.patch(`/courses/admin/${id}/publish`),
  deleteAdmin: (id) => api.delete(`/courses/admin/${id}`),
  getStats: (id) => api.get(`/courses/admin/${id}/stats`),
};


// Enrollments
export const enrollmentsAPI = {
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getMyCourses: () => api.get('/my/courses'),
  getProgress: (courseId) => api.get(`/my/courses/${courseId}/progress`),
};

// Progress
export const progressAPI = {
  updateLessonProgress: (lessonId, status) => 
    api.post(`/lessons/${lessonId}/progress`, { status }),
};

// Quiz
export const quizAPI = {
  // Routes Formateur - Créer, modifier, supprimer
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  
  // Routes Étudiant - Passer un quiz
  startAttempt: (quizid) => api.post(`/quizzes/${quizid}/start`, {}),
  submitAnswers: (attemptid, answers) => api.post('/quizzes/attempt/submit', { attemptid, answers }),
  getResults: (attemptid) => api.get(`/quizzes/attempt/${attemptid}/results`),
  
  // Routes publiques (authentifiées) - Récupérer quizzes
  getByModule: (moduleid) => api.get(`/quizzes/module/${moduleid}`),
  getById: (id) => api.get(`/quizzes/${id}`),
};

// Chatbot
export const chatbotAPI = {
  sendMessage: (message, courseId) => 
    api.post('/chatbot/message', { message, courseId }),
  getHistory: (sessionId) => api.get(`/chatbot/sessions/${sessionId}/history`),
};

// Dashboard
export const dashboardAPI = {
  getTrainerStats: () => api.get('/dashboard/trainer'),
  getAdminStats: () => api.get('/dashboard/admin'),
};

// Users
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Analytics
export const analyticsAPI = {
  getGlobalStats: () => api.get('/analytics/global'),
  getStatsByPeriod: (period) => api.get('/analytics/period', { params: { period } }),
  getTopCourses: (limit) => api.get('/analytics/top-courses', { params: { limit } }),
  getCategoryDistribution: () => api.get('/analytics/categories'),
  getTopTrainers: (limit) => api.get('/analytics/top-trainers', { params: { limit } }),
  getCompletionRates: () => api.get('/analytics/completion-rates'),
  getRecentActivity: (limit) => api.get('/analytics/recent-activity', { params: { limit } }),
};

export const quizAPIs = {
  // Routes Formateur
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  
  // Routes Étudiant
  getByModule: (moduleid) => api.get(`/quizzes/module/${moduleid}`),
  getById: (id) => api.get(`/quizzes/${id}`),
  startAttempt: (quizid) => api.post(`/quizzes/${quizid}/start`),
  submitAnswers: (attemptid, answers) => api.post('/quizzes/attempt/submit', { attemptid, answers }),
  getResults: (attemptid) => api.get(`/quizzes/attempt/${attemptid}/results`),
};

export default api;
