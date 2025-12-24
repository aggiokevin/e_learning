import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { Users, BookOpen, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../../components/Dashboard/StatCard';
import Card from '../../components/Common/Card';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getAdminStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="text-white" size={24} />}
            title="Utilisateurs"
            value={stats?.users?.total || 0}
            subtitle={`${stats?.users?.active || 0} actifs`}
            color="bg-primary-600"
          />
          <StatCard
            icon={<BookOpen className="text-white" size={24} />}
            title="Cours"
            value={stats?.courses?.total || 0}
            subtitle={`${stats?.courses?.published || 0} publiés`}
            color="bg-green-600"
          />
          <StatCard
            icon={<Activity className="text-white" size={24} />}
            title="Inscriptions"
            value={stats?.enrollments?.total || 0}
            subtitle={`${stats?.enrollments?.completed || 0} terminées`}
            color="bg-coral-600"
          />
          <StatCard
            icon={<TrendingUp className="text-white" size={24} />}
            title="Taux de réussite"
            value={`${Math.round(stats?.completionRate || 0)}%`}
            color="bg-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/users">
            <Card hover className="text-center cursor-pointer">
              <Users size={48} className="mx-auto text-primary-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Gérer les utilisateurs</h3>
              <p className="text-gray-600 text-sm">Ajouter, modifier ou supprimer des utilisateurs</p>
            </Card>
          </Link>

          <Link to="/admin/courses">
            <Card hover className="text-center cursor-pointer">
              <BookOpen size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Gérer les cours</h3>
              <p className="text-gray-600 text-sm">Superviser tous les cours de la plateforme</p>
            </Card>
          </Link>

          <Link to="/admin/analytics">
            <Card hover className="text-center cursor-pointer">
              <TrendingUp size={48} className="mx-auto text-coral-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Statistiques</h3>
              <p className="text-gray-600 text-sm">Voir les analyses détaillées</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
