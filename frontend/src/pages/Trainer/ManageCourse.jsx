import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../services/api';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';
import toast from 'react-hot-toast';

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order_index: 0
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    content_type: 'video',
    content_url_or_text: '',
    order_index: 0,
    estimated_duration_minutes: 10
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await coursesAPI.getById(id);
      setCourse(response.data.course);
    } catch (error) {
      toast.error('Erreur lors du chargement du cours');
      navigate('/trainer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.createModule(id, moduleForm);
      toast.success('Module ajouté avec succès');
      setShowModuleModal(false);
      setModuleForm({ title: '', description: '', order_index: 0 });
      fetchCourse();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du module');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.createLesson(selectedModuleId, lessonForm);
      toast.success('Leçon ajoutée avec succès');
      setShowLessonModal(false);
      setLessonForm({
        title: '',
        content_type: 'video',
        content_url_or_text: '',
        order_index: 0,
        estimated_duration_minutes: 10
      });
      fetchCourse();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la leçon');
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/trainer/dashboard')}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Retour au dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
              <p className="text-gray-600 mt-1">{course?.description}</p>
            </div>
            <Button
              onClick={() => setShowModuleModal(true)}
              variant="primary"
            >
              <Plus size={20} className="mr-2" />
              Ajouter un module
            </Button>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {course?.modules?.length > 0 ? (
            course.modules.map((module, index) => (
              <Card key={module.id}>
                <div className="flex items-center justify-between p-4 border-b">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="flex-1 flex items-center justify-between text-left"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        Module {index + 1}: {module.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {module.lessons?.length || 0} leçon(s)
                      </p>
                    </div>
                    {expandedModules.includes(module.id) ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>
                  <Button
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setShowLessonModal(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    <Plus size={16} className="mr-1" />
                    Leçon
                  </Button>
                </div>

                {expandedModules.includes(module.id) && (
                  <div className="p-4">
                    {module.lessons?.length > 0 ? (
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div>
                              <p className="font-medium">
                                {lessonIndex + 1}. {lesson.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {lesson.content_type} - {lesson.estimated_duration_minutes} min
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button className="text-primary-600 hover:text-primary-700">
                                <Edit size={18} />
                              </button>
                              <button className="text-red-600 hover:text-red-700">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Aucune leçon. Cliquez sur "Ajouter une leçon" pour commencer.
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Aucun module pour le moment</p>
                <Button onClick={() => setShowModuleModal(true)} variant="primary">
                  Créer le premier module
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Module Modal */}
        <Modal
          isOpen={showModuleModal}
          onClose={() => setShowModuleModal(false)}
          title="Ajouter un module"
        >
          <form onSubmit={handleAddModule}>
            <Input
              label="Titre du module"
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => setShowModuleModal(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Ajouter
              </Button>
            </div>
          </form>
        </Modal>

        {/* Lesson Modal */}
        <Modal
          isOpen={showLessonModal}
          onClose={() => setShowLessonModal(false)}
          title="Ajouter une leçon"
        >
          <form onSubmit={handleAddLesson}>
            <Input
              label="Titre de la leçon"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de contenu
              </label>
              <select
                value={lessonForm.content_type}
                onChange={(e) => setLessonForm({ ...lessonForm, content_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="video">Vidéo</option>
                <option value="text">Texte</option>
                <option value="pdf">PDF</option>
                <option value="link">Lien externe</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                value={lessonForm.content_url_or_text}
                onChange={(e) => setLessonForm({ ...lessonForm, content_url_or_text: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder={lessonForm.content_type === 'text' ? 'Écrivez votre contenu...' : 'URL du contenu'}
                required
              />
            </div>
            <Input
              label="Durée estimée (minutes)"
              type="number"
              value={lessonForm.estimated_duration_minutes}
              onChange={(e) => setLessonForm({ ...lessonForm, estimated_duration_minutes: parseInt(e.target.value) })}
              required
            />
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => setShowLessonModal(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
Ajouter
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCourse;
