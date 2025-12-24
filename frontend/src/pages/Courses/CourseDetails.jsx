import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Clock, Users, Star, BookOpen, Award, CheckCircle, 
  PlayCircle, FileText, Link as LinkIcon, Lock 
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import { getLevelBadgeColor, formatDuration } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [id, isAuthenticated]);

  const fetchCourseDetails = async () => {
    try {
      const response = await coursesAPI.getById(id);
      setCourse(response.data.course);
    } catch (error) {
      toast.error('Erreur lors du chargement du cours');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await enrollmentsAPI.getMyCourses();
      const enrolled = response.data.courses.some(c => c.id === parseInt(id));
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Erreur vérification inscription');
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour vous inscrire');
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentsAPI.enroll(id);
      toast.success('Inscription réussie !');
      setIsEnrolled(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setEnrolling(false);
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle size={16} className="text-primary-600" />;
      case 'text': return <FileText size={16} className="text-green-600" />;
      case 'pdf': return <FileText size={16} className="text-red-600" />;
      case 'link': return <LinkIcon size={16} className="text-blue-600" />;
      default: return <FileText size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) return null;

  const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
  const totalDuration = course.modules?.reduce((acc, module) => 
    acc + (module.lessons?.reduce((sum, lesson) => sum + (lesson.estimated_duration_minutes || 0), 0) || 0), 0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadgeColor(course.level)}`}>
                  {course.level}
                </span>
                <span className="ml-2 text-primary-100">{course.category}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-primary-100 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-primary-100">
                <div className="flex items-center">
                  <Clock size={20} className="mr-2" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={20} className="mr-2" />
                  <span>{totalLessons} leçons</span>
                </div>
                <div className="flex items-center">
                  <Users size={20} className="mr-2" />
                  <span>{course.enrollments_count || 0} inscrits</span>
                </div>
                {course.average_rating && (
                  <div className="flex items-center">
                    <Star size={20} className="mr-2 text-yellow-400 fill-current" />
                    <span>{course.average_rating}</span>
                  </div>
                )}
              </div>

              {course.creator_name && (
                <div className="mt-6 pt-6 border-t border-primary-600">
                  <p className="text-primary-100">Créé par <span className="font-semibold text-white">{course.creator_name}</span></p>
                </div>
              )}
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={course.thumbnail_url || 'https://via.placeholder.com/400x300'} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {isEnrolled ? (
                  <>
                    <Button 
                      onClick={() => navigate(`/courses/${id}/learn`)}
                      variant="primary" 
                      className="w-full mb-3"
                    >
                      Continuer le cours
                    </Button>
                    <Link to="/my-courses">
                      <Button variant="outline" className="w-full">
                        Mes cours
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button 
                    onClick={handleEnroll}
                    variant="coral" 
                    className="w-full"
                    disabled={enrolling}
                  >
                    {enrolling ? 'Inscription...' : 'S\'inscrire au cours'}
                  </Button>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Ce cours inclut :</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Accès à vie
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      {totalLessons} leçons vidéo
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Quiz et exercices
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Certificat de réussite
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Support chatbot IA
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu du cours</h2>
            
            <div className="space-y-4">
              {course.modules?.map((module, moduleIndex) => (
                <Card key={module.id} className="overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <BookOpen size={16} className="mr-1" />
                      <span>{module.lessons?.length || 0} leçons</span>
                    </div>
                  </div>

                  <div className="divide-y">
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <div 
                        key={lesson.id} 
                        className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center flex-1">
                          {getContentIcon(lesson.content_type)}
                          <span className="ml-3 text-gray-700">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {formatDuration(lesson.estimated_duration_minutes || 0)}
                          </span>
                          {!isEnrolled && lessonIndex > 1 && (
                            <Lock size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <Card>
              <h3 className="font-semibold text-lg mb-4">Compétences acquises</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle size={20} className="mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Maîtrise des concepts fondamentaux</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Capacité à réaliser des projets concrets</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Préparation pour le marché du travail</span>
                </li>
              </ul>
            </Card>

            <Card className="mt-6">
              <div className="text-center">
                <Award size={48} className="mx-auto text-yellow-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Certificat inclus</h3>
                <p className="text-gray-600 text-sm">
                  Obtenez un certificat à la fin de la formation pour valoriser vos compétences
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
