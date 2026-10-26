import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import { 
  Users, BookOpen, TrendingUp, Award, 
  Activity, BarChart3, PieChart, Clock 
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState(null);
  const [periodStats, setPeriodStats] = useState(null);
  const [topCourses, setTopCourses] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [topTrainers, setTopTrainers] = useState([]);
  const [completionRates, setCompletionRates] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchAllData();
  }, [selectedPeriod]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        globalRes,
        periodRes,
        topCoursesRes,
        categoriesRes,
        trainersRes,
        completionRes,
        activityRes
      ] = await Promise.all([
        analyticsAPI.getGlobalStats(),
        analyticsAPI.getStatsByPeriod(selectedPeriod),
        analyticsAPI.getTopCourses(10),
        analyticsAPI.getCategoryDistribution(),
        analyticsAPI.getTopTrainers(10),
        analyticsAPI.getCompletionRates(),
        analyticsAPI.getRecentActivity(20)
      ]);

      setGlobalStats(globalRes.data);
      setPeriodStats(periodRes.data);
      setTopCourses(topCoursesRes.data);
      console.log('Catégorie Distribution:', topCoursesRes.data);
      setCategoryDistribution(categoriesRes.data);
      setTopTrainers(trainersRes.data);
      setCompletionRates(completionRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtext, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {subtext && (
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp size={16} className="text-green-500 mr-1" />
          <span className="text-green-500 text-sm font-semibold">{trend}</span>
          <span className="text-gray-500 text-sm ml-1">aujourd'hui</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
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
            Tableau de bord analytique
          </h1>
          <p className="text-gray-600">Vue d'ensemble des performances de la plateforme</p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Utilisateurs"
            value={globalStats?.users?.total_users || 0}
            subtext={`${globalStats?.users?.total_trainees || 0} apprenants, ${globalStats?.users?.total_trainers || 0} formateurs`}
            color="bg-blue-500"
            trend={`+${globalStats?.users?.new_users_today || 0}`}
          />
          <StatCard
            icon={BookOpen}
            title="Total Cours"
            value={globalStats?.courses?.total_courses || 0}
            subtext={`${globalStats?.courses?.published_courses || 0} publiés`}
            color="bg-green-500"
            trend={`+${globalStats?.courses?.new_courses_today || 0}`}
          />
          <StatCard
            icon={Award}
            title="Inscriptions"
            value={globalStats?.enrollments?.total_enrollments || 0}
            subtext={`${Math.round(globalStats?.enrollments?.average_progress || 0)}% progression moyenne`}
            color="bg-yellow-500"
            trend={`+${globalStats?.enrollments?.new_enrollments_today || 0}`}
          />
          <StatCard
            icon={Activity}
            title="Quiz Complétés"
            value={globalStats?.quiz?.total_attempts || 0}
            subtext={`${Math.round(globalStats?.quiz?.average_score || 0)}% score moyen`}
            color="bg-purple-500"
          />
        </div>

        {/* Sélecteur de période */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Évolution temporelle</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="6months">6 derniers mois</option>
              <option value="1year">1 an</option>
            </select>
          </div>

          {/* Graphique d'évolution */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={periodStats?.newUsers || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                name="Nouveaux utilisateurs"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Cours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="mr-2" />
              Top 10 Cours
            </h2>
            <div className="space-y-3">
              {topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600">{course.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{course.enrollments_count}</p>
                    <p className="text-xs text-gray-500">inscrits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Répartition par catégorie */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <PieChart className="mr-2" />
              Répartition par Catégorie
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={categoryDistribution}
                  dataKey="enrollments_count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Formateurs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="mr-2" />
            Top 10 Formateurs
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Formateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Inscrits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Progression moy.
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topTrainers.map((trainer) => (
                  <tr key={trainer.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {trainer.first_name} {trainer.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{trainer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {trainer.courses_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-semibold">{trainer.total_enrollments}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.round(trainer.average_student_progress || 0)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(trainer.average_student_progress || 0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Taux de complétion */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2" />
            Taux de Complétion des Cours
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completion_rate" fill="#10B981" name="Taux de complétion (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="mr-2" />
            Activité Récente
           </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'enrollment' ? 'bg-blue-100' :
                    activity.type === 'course_created' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'enrollment' && <BookOpen size={16} className="text-blue-600" />}
                    {activity.type === 'course_created' && <Award size={16} className="text-green-600" />}
                    {activity.type === 'user_registered' && <Users size={16} className="text-purple-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.first_name} {activity.last_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.type === 'enrollment' && `S'est inscrit à "${activity.course_title}"`}
                      {activity.type === 'course_created' && `A créé le cours "${activity.course_title}"`}
                      {activity.type === 'user_registered' && `A créé un compte ${activity.course_title}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;