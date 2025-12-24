import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, FileText } from 'lucide-react';

const ModuleList = ({ modules, onLessonClick }) => {
  const [expandedModules, setExpandedModules] = useState([]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getContentIcon = (type) => {
    return type === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />;
  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleModule(module.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">
                Module {index + 1}: {module.title}
              </span>
              <span className="ml-3 text-sm text-gray-500">
                ({module.lessons?.length || 0} leçons)
              </span>
            </div>
            {expandedModules.includes(module.id) ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>

          {expandedModules.includes(module.id) && (
            <div className="border-t divide-y">
              {module.lessons?.map((lesson, lessonIndex) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonClick(lesson)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    {getContentIcon(lesson.content_type)}
                    <span className="text-gray-700">
                      {lessonIndex + 1}. {lesson.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {lesson.estimated_duration_minutes} min
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModuleList;
