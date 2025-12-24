import React from 'react';
import { Clock, BookOpen, Award } from 'lucide-react';
import { formatDuration } from '../../utils/helpers';

const CourseDetail = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
          <p className="text-gray-600">{course.description}</p>
        </div>
        <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
          {course.level}
        </span>
      </div>

      <div className="flex items-center space-x-6 text-gray-600">
        <div className="flex items-center">
          <Clock size={18} className="mr-2" />
          <span>{formatDuration(course.duration_minutes)}</span>
        </div>
        <div className="flex items-center">
          <BookOpen size={18} className="mr-2" />
          <span>{course.modules_count} modules</span>
        </div>
        <div className="flex items-center">
          <Award size={18} className="mr-2" />
          <span>Certificat inclus</span>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
