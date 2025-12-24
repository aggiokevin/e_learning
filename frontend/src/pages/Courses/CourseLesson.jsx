import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI, progressAPI, quizAPI } from '../../services/api';
import { 
  ChevronLeft, ChevronRight, CheckCircle, Circle, 
  PlayCircle, FileText, BookOpen, Award 
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import toast from 'react-hot-toast';

const CourseLesson = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchCourseAndProgress();
  }, [id]);

  const fetchCourseAndProgress = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        coursesAPI.getById(id),
        enrollmentsAPI.getProgress(id)
      ]);

      setCourse(courseRes.data.course);
      setProgress(progressRes.data);

      // Set first lesson as current
      if (courseRes.data.course.modules?.length > 0) {
        const firstModule = courseRes.data.course.modules[0];
        if (firstModule.lessons?.length > 0) {
          setCurrentModule(firstModule);
          setCurrent
Lesson(firstModule.lessons[0]);
        }
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du cours');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      await progressAPI.updateLessonProgress(lessonId, 'completed');
      toast.success('Leçon marquée comme terminée !');
      // Refresh progress
      const progressRes = await enrollmentsAPI.getProgress(id);
      setProgress(progressRes.data);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const navigateToLesson = (module, lesson) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
    setShowQuiz(false);
    window.scrollTo(0, 0);
  };

  const getNextLesson = () => {
    const modules = course?.modules || [];
    const currentModuleIndex = modules.findIndex(m => m.id === currentModule?.id);
    const currentLessonIndex = currentModule?.lessons?.findIndex(l => l.id === currentLesson?.id);

    // Next lesson in same module
    if (currentLessonIndex < currentModule?.lessons?.length - 1) {
      return {
        module: currentModule,
        lesson: currentModule.lessons[currentLessonIndex + 1]
      };
    }

    // First lesson of next module
    if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      return {
        module: nextModule,
        lesson: nextModule.lessons?.[0]
      };
    }

    return null;
  };

  const getPreviousLesson = () => {
    const modules = course?.modules || [];
    const currentModuleIndex = modules.findIndex(m => m.id === currentModule?.id);
    const currentLessonIndex = currentModule?.lessons?.findIndex(l => l.id === currentLesson?.id);

    // Previous lesson in same module
    if (currentLessonIndex > 0) {
      return {
        module: currentModule,
        lesson: currentModule.lessons[currentLessonIndex - 1]
      };
    }

    // Last lesson of previous module
    if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      const lastLesson = prevModule.lessons?.[prevModule.lessons.length - 1];
      return {
        module: prevModule,
        lesson: lastLesson
      };
    }

    return null;
  };

  const getLessonStatus = (lessonId) => {
    const lessonProgress = progress?.modules
      ?.flatMap(m => m.lessons)
      ?.find(l => l.id === lessonId);
    return lessonProgress?.progress_status || 'not_started';
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.content_type) {
      case 'video':
        return (
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {currentLesson.content_url_or_text?.includes('youtube') ? (
              <iframe
                className="w-full h-full"
                src={currentLesson.content_url_or_text}
                title={currentLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video className="w-full h-full" controls>
                <source src={currentLesson.content_url_or_text} type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            )}
          </div>
        );

      case 'text':
        return (
          <Card>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {currentLesson.content_url_or_text}
              </p>
            </div>
          </Card>
        );

      case 'pdf':
        return (
          <Card>
            <div className="text-center py-8">
              <FileText size={64} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Document PDF</h3>
              <a 
                href={currentLesson.content_url_or_text}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Ouvrir le document
              </a>
            </div>
          </Card>
        );

      case 'link':
        return (
          <Card>
            <div className="text-center py-8">
              <BookOpen size={64} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ressource externe</h3>
              <a 
                href={currentLesson.content_url_or_text}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Accéder à la ressource
              </a>
            </div>
          </Card>
        );

      default:
        return <p>Type de contenu non supporté</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const prevLesson = getPreviousLesson();
  const lessonStatus = getLessonStatus(currentLesson?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="mb-4 pb-4 border-b">
                <button 
                  onClick={() => navigate(`/courses/${id}`)}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <ChevronLeft size={20} />
                  <span className="ml-1">Retour au cours</span>
                </button>
                <h2 className="font-semibold text-lg mt-4 line-clamp-2">{course?.title}</h2>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {course?.modules?.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <h3 className="font-semibold text-sm text-gray-900 mb-2">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    <div className="space-y-1">
                      {module.lessons?.map((lesson) => {
                        const status = getLessonStatus(lesson.id);
                        const isActive = currentLesson?.id === lesson.id;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(module, lesson)}
                            className={`w-full flex items-center p-2 rounded text-left transition-colors ${
                              isActive 
                                ? 'bg-primary-50 text-primary-700 font-medium' 
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {status === 'completed' ? (
                              <CheckCircle size={16} className="mr-2 text-green-600 flex-shrink-0" />
                            ) : (
                              <Circle size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-sm line-clamp-2">{lesson.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <Card className="mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <PlayCircle size={16} className="mr-1" />
                    <span>{currentModule?.title}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentLesson?.title}
                  </h1>
                  <p className="text-gray-600">
                    Durée estimée : {currentLesson?.estimated_duration_minutes || 0} minutes
                  </p>
                </div>
                
                {lessonStatus !== 'completed' && (
                  <Button
                    onClick={() => markLessonComplete(currentLesson?.id)}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Marquer terminé
                  </Button>
                )}
              </div>
            </Card>

            {/* Lesson Content */}
            <div className="mb-6">
              {renderLessonContent()}
            </div>

            {/* Navigation */}
            <Card>
              <div className="flex justify-between items-center">
                <div>
                  {prevLesson ? (
                    <button
                      onClick={() => navigateToLesson(prevLesson.module, prevLesson.lesson)}
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <ChevronLeft size={20} />
                      <span>Leçon précédente</span>
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>

                <div>
                  {nextLesson ? (
                    <button
                      onClick={() => navigateToLesson(nextLesson.module, nextLesson.lesson)}
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <span>Leçon suivante</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/courses/${id}`)}
                      className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Award size={20} className="mr-2" />
                      <span>Cours terminé !</span>
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Module Quiz (if available) */}
            {currentModule && !nextLesson && (
              <Card className="mt-6">
                <div className="text-center py-8">
                  <Award size={64} className="mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Fin du module</h3>
                  <p className="text-gray-600 mb-4">
                    Félicitations ! Vous avez terminé ce module.
                  </p>
                  <Button variant="coral" onClick={() => setShowQuiz(true)}>
                    Passer au quiz
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLesson;
