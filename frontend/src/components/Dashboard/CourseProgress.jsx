import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../Common/Card';

const CourseProgress = ({ course }) => {
  const progress = course.progress_percentage || 0;

  return (
    <Card hover>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.category}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          course.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {course.status === 'completed' ? 'Terminé' : 'En cours'}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link 
        to={`/courses/${course.id}`}
        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
      >
        Continuer <ArrowRight size={16} className="ml-1" />
      </Link>
    </Card>
  );
};

export default CourseProgress;
