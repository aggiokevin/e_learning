import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { coursesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { confirmToastAsync } from '../../utils/help';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseEditor = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getById(id);
      setCourse(response.data.course);
    } catch (error) {
      toast.error('Erreur lors du chargement du cours');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handlePublish = async () => {
    if (!course) return;

    const confirmed = await confirmToastAsync('Publier ce cours ?',"confirm");
    if (!confirmed) return;

    try {
      setIsPublishing(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/courses/${course.id}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Cours publié avec succès');
      fetchCourse();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Erreur lors de la publication'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!course) return;

    const confirmed = await confirmToastAsync('Dépublier ce cours ?',"delete");
    if (!confirmed) return;

    try {
      setIsPublishing(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/courses/${course.id}/unpublish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Cours dépublié avec succès');
      fetchCourse();
    } catch (error) {
      toast.error('Erreur lors de la dépublication');
    } finally {
      setIsPublishing(false);
    }
  };

  /* ---------- Guards de rendu ---------- */

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Chargement du cours...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center text-red-500">
        Cours introuvable
      </div>
    );
  }

  /* ---------- Render ---------- */

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{course.title}</h2>

      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            course.is_published
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {course.is_published ? '✅ Publié' : '📝 Brouillon'}
        </span>
      </div>

      <div className="space-y-4">
        {!course.is_published ? (
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isPublishing ? 'Publication...' : '🚀 Publier le cours'}
          </button>
        ) : (
          <button
            onClick={handleUnpublish}
            disabled={isPublishing}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 mb-4"
          >
            {isPublishing ? 'Dépublication...' : 'Dépublier le cours'}
          </button>
        )}
      </div>
        {/* <br /> */}
      <div className="flex items-center justify-between mb-4">
        {/* <Link
          to={`/trainer/quiz/create/${course.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <Plus size={20} />
          <span>Créer un quiz</span>
        </Link> */}
      </div>
      {/* Lister les quizzes du module */}
      <div className="space-y-3">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="p-4 bg-white rounded-lg border flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
              <p className="text-sm text-gray-600">{quiz.questions_count} questions</p>
            </div>
            <Link
              to={`/student/quiz/${quiz.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Voir le quiz
            </Link>
          </div>
        ))}
      </div>

      {!course.is_published && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Checklist avant publication
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>✅ Titre et description complétés</li>
            <li>✅ Au moins 1 module créé</li>
            <li>✅ Au moins 1 leçon ajoutée</li>
            <li>✅ Contenu vérifié</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseEditor;