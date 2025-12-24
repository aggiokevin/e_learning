import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
      window.location.href = '/login';
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
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  createModule: (courseId, data) => api.post(`/courses/${courseId}/modules`, data),
  createLesson: (moduleId, data) => api.post(`/courses/modules/${moduleId}/lessons`, data),
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
  getByModule: (moduleId) => api.get(`/modules/${moduleId}/quiz`),
  startAttempt: (quizId) => api.post(`/quizzes/${quizId}/attempts`),
  submitAnswers: (attemptId, answers) => 
    api.post(`/quiz-attempts/${attemptId}/answers`, { answers }),
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
};

export default api;
