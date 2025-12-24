import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentsAPI } from '../../services/api';
import CourseCard from '../../components/Course/CourseCard';
import { BookOpen, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in_progress, completed

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [filter, courses]);

  const fetchMyCourses = async () => {
    try {
      const response = await enrollmentsAPI.getMyCourses();
      setCourses(response.data.courses);
      setFilteredCourses(response.data.courses);
    } catch (error) {
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (filter === 'all') {
      setFilteredCourses(courses);
    } else if (filter === 'in_progress') {
      setFilteredCourses(courses.filter(c => c.status === 'enrolled'));
    } else if (filter === 'completed') {
      setFilteredCourses(courses.filter(c => c.status === 'completed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Formations
          </h1>
          <p className="text-gray-600">
            Gérez et suivez vos cours en ligne
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-500" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({courses.length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in_progress'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours ({courses.filter(c => c.status === 'enrolled').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terminés ({courses.filter(c => c.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="relative">
                <CourseCard course={course} />
                {/* Progress overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "Vous n'êtes inscrit à aucun cours" 
                : `Aucun cours ${filter === 'completed' ? 'terminé' : 'en cours'}`}
            </p>
            <Link to="/courses">
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                Explorer le catalogue
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
