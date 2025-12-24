import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { getLevelBadgeColor, formatDuration } from '../../utils/helpers';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.thumbnail_url || 'https://via.placeholder.com/400x300'} 
            alt={course.title}
            className="w-full h-full object-cover"
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
              {course.modules?.length || 0} modules
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
