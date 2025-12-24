import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Clock, Target, ArrowRight } from 'lucide-react';
import Card from '../../components/Common/Card';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    totalHours: 0,
    certificates: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await enrollmentsAPI.getMyCourses();
      const courses = response.data.courses;
      setMyCourses(courses);

      // Calculate stats
      const completed = courses.filter(c => c.status === 'completed').length;
      const totalHours = courses.reduce((acc, c) => acc + (c.estimated_duration_minutes || 0), 0) / 60;
      
      setStats({
        enrolled: courses.length,
        completed,
        totalHours: Math.round(totalHours),
        certificates: completed
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, value, label, color }) => (
    <Card>
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-lg mr-4
`}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className="text-gray-600">{label}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {user?.name} 👋
          </h1>
          <p className="text-gray-600">Continuez votre apprentissage</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<BookOpen className="text-white" size={24} />}
            value={stats.enrolled}
            label="Cours en cours"
            color="bg-blue-500"
          />
          <StatCard 
            icon={<Award className="text-white" size={24} />}
            value={stats.certificates}
            label="Certificats"
            color="bg-yellow-500"
          />
          <StatCard 
            icon={<Clock className="text-white" size={24} />}
            value={`${stats.totalHours}h`}
            label="Heures de formation"
            color="bg-cyan-500"
          />
          <StatCard 
            icon={<Target className="text-white" size={24} />}
            value={stats.completed}
            label="Objectifs atteints"
            color="bg-green-500"
          />
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes formations en cours</h2>
            <Link to="/courses" className="text-primary-600 hover:text-primary-700 flex items-center">
              Voir tout <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-48 animate-pulse" />
              ))}
            </div>
          ) : myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCourses.slice(0, 4).map(course => (
                <Card key={course.id} hover>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">{course.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.status === 'completed' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progression</span>
                      <span className="font-semibold">{course.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  <Link 
                    to={`/courses/${course.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    Continuer le cours <ArrowRight size={16} className="ml-1" />
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Vous n'êtes inscrit à aucun cours</p>
                <Link to="/courses">
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                    Explorer le catalogue
                  </button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
