import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { BookOpen, Users, TrendingUp, Plus } from 'lucide-react';
import StatCard from '../../components/Dashboard/StatCard';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import toast from 'react-hot-toast';

const TrainerDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getTrainerStats();
      setCourses(response.data.courses);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = courses.reduce((acc, course) => acc + (course.enrollments_count || 0), 0);
  const avgCompletion = courses.length > 0
    ? courses.reduce((acc, course) => acc + (course.completion_rate || 0), 0) / courses.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Formateur</h1>
            <p className="text-gray-600 mt-1">Gérez vos cours et suivez vos étudiants</p>
          </div>
          <Link to="/trainer/create-course">
            <Button variant="primary">
              <Plus size={20} className="mr-2" />
              Créer un cours
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="text-white" size={24} />}
            title="Mes cours"
            value={courses.length}
            color="bg-primary-600"
          />
          <StatCard
            icon={<Users className="text-white" size={24} />}
            title="Total étudiants"
            value={totalStudents}
            color="bg-green-600"
          />
          <StatCard
            icon={<TrendingUp className="text-white" size={24} />}
            title="Taux de complétion"
            value={`${Math.round(avgCompletion)}%`}
            color="bg-coral-600"
          />
        </div>

        {/* Courses List */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mes cours</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscrits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complétion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note moyenne</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{course.title}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{course.enrollments_count || 0}</td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{Math.round(course.completion_rate || 0)}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {course.avg_score ? `${course.avg_score.toFixed(1)}/100` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/trainer/courses/${course.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Gérer
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de cours</p>
              <Link to="/trainer/create-course">
                <Button variant="primary">Créer mon premier cours</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrainerDashboard;
