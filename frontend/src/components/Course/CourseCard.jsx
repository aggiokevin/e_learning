import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { getLevelBadgeColor, formatDuration } from '../../utils/helpers';

const CourseCard = ({ course }) => {
  console.log('Course data in CourseCard:', course.modules);
  // Construire l'URL complète de l'image
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseURL = API_URL.replace('/api', ''); // Enlever /api pour avoir l'URL de base
  
  // Utiliser image_url au lieu de thumbnail_url
  const imageUrl = course.image_url 
    ? `${baseURL}${course.image_url}` 
    : 'https://via.placeholder.com/400x300?text=Formation';

  // Utiliser course_id (nom de colonne dans la DB) au lieu de id
  const courseId = course.course_id || course.id;

  return (
    <Link to={`/courses/${courseId}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si l'image ne charge pas, afficher un placeholder
              e.target.src = 'https://via.placeholder.com/400x300?text=Formation';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelBadgeColor(course.level)}`}>
              {course.level}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <BookOpen size={16} className="mr-1" />
            <span>{course.category}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <BookOpen size={14} className="mr-1" />
              {course.modules} modules
              {console.log(course.modules)}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {formatDuration(course.estimated_duration_minutes || 0)}
              </span>
              <span className="flex items-center">
                <Users size={16} className="mr-1" />
                {course.enrollments_count || 0}
              </span>
            </div>
            {course.average_rating && (
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-current mr-1" />
                <span className="font-semibold">{course.average_rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
