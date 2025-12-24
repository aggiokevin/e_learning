import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, Settings, 
  BarChart3, FolderOpen, Award, Home 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = {
    TRAINEE: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/my-courses', icon: BookOpen, label: 'Mes cours' },
      { path: '/courses', icon: FolderOpen, label: 'Catalogue' },
      { path: '/certificates', icon: Award, label: 'Certificats' },
    ],
    TRAINER: [
      { path: '/trainer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/trainer/courses', icon: BookOpen, label: 'Mes cours' },
      { path: '/trainer/create-course', icon: FolderOpen, label: 'Créer un cours' },
      { path: '/trainer/students', icon: Users, label: 'Étudiants' },
      { path: '/trainer/analytics', icon: BarChart3, label: 'Statistiques' },
    ],
    ADMIN: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
      { path: '/admin/courses', icon: BookOpen, label: 'Cours' },
      { path: '/admin/analytics', icon: BarChart3, label: 'Statistiques' },
      { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
    ]
  };

  const items = navItems[user?.role] || navItems.TRAINEE;

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Home className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold">FormaPro</span>
        </Link>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
