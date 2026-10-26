import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import { confirmToastAsync } from '../../utils/help';
import { 
  Search, Filter, Eye, EyeOff, Trash2, 
  Edit, MoreVertical, Users, BookOpen 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    is_published: ''
  });
  const [showMenu, setShowMenu] = useState(null);

  const categories = ['Développement', 'Marketing', 'Design', 'Bureautique', 'Langues', 'Soft Skills', 'Data Science', 'Business'];
  const levels = ['débutant', 'intermédiaire', 'avancé'];

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAllAdmin(filters);
      setCourses(response.data.courses);
      console.log(response.data.courses);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      const response = await coursesAPI.togglePublish(courseId);
      toast.success(response.data.message);
      fetchCourses();
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (courseId, courseTitle) => {
    const confirmed = await confirmToastAsync('Supprimer ce cours ?',"delete");
    if (!confirmed) return;

    try {
      await coursesAPI.deleteAdmin(courseId);
      toast.success('Cours supprimé avec succès');
      fetchCourses();
    } catch (error) {
      toast.error('Erreur lors de la suppression du cours');
    }
  };

  const CourseCard = ({ course }) => {
  // Fonction locale pour construire l'URL de l'image
  const buildImageUrl = () => {
    if (!course.image_url) {
      return 'https://via.placeholder.com/400x300?text=Formation';
    }
    
    if (course.image_url.startsWith('http')) {
      return course.image_url;
    }
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseURL = API_URL.replace('/api', '');
    const cleanPath = course.image_url.startsWith('/') ? course.image_url : `/${course.image_url}`;
    
    return `${baseURL}${cleanPath}`;
  };

  const imageUrl = buildImageUrl();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('❌ Erreur chargement image:', imageUrl);
            e.target.src = 'https://via.placeholder.com/400x300?text=Formation';
            e.target.onerror = null;
          }}
        />
        
        {/* Badge de statut */}
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            course.is_published === 1
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {course.is_published === 1 ? 'Publié' : 'Brouillon'}
          </span>
        </div>
        
        {/* Badge de niveau */}
        <div className="absolute top-2 left-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            course.level === 'débutant'
              ? 'bg-blue-100 text-blue-800'
              : course.level === 'intermédiaire'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <span className="text-xs text-primary-600 font-semibold uppercase">
          {course.category}
        </span>

        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="mb-3 pb-3 border-b border-gray-200">
          <p className="text-xs text-gray-500">
            Par <span className="font-semibold text-gray-700">{course.trainer_name}</span>
          </p>
          <p className="text-xs text-gray-400">{course.trainer_email}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{course.enrollments_count} inscrits</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>{course.modules_count} modules</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleTogglePublish(course.id, course.is_published)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              course.is_published === 1
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {course.is_published === 1 ? (
              <>
                <EyeOff size={16} />
                <span>Dépublier</span>
              </>
            ) : (
              <>
                <Eye size={16} />
                <span>Publier</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleDelete(course.id, course.title)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Créé le {new Date(course.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des cours
          </h1>
          <p className="text-gray-600">
            Gérez tous les cours de la plateforme
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Catégorie */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Niveau */}
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les niveaux</option>
              {levels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>

            {/* Statut de publication */}
            <select
              value={filters.is_published}
              onChange={(e) => handleFilterChange('is_published', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="1">Publiés</option>
              <option value="0">Brouillons</option>
            </select>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total des cours</p>
            <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Cours publiés</p>
            <p className="text-3xl font-bold text-green-600">
              {courses.filter(c => c.is_published === 1).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Brouillons</p>
            <p className="text-3xl font-bold text-gray-600">
              {courses.filter(c => c.is_published === 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total inscrits</p>
            <p className="text-3xl font-bold text-blue-600">
              {courses.reduce((sum, c) => sum + (c.enrollments_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Liste des cours */}
        {courses.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              {courses.length} cours trouvé{courses.length > 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Aucun cours trouvé</p>
            <p className="text-gray-500 text-sm mt-2">
              Modifiez vos filtres pour voir plus de résultats
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
