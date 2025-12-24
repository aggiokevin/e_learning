import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

const LessonViewer = ({ lesson }) => {
  if (!lesson) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500">Sélectionnez une leçon pour commencer</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (lesson.content_type) {
      case 'video':
        return (
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={lesson.content_url_or_text}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {lesson.content_url_or_text}
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="text-center py-12">
            <FileText size={64} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Document PDF</h3>
            <a
              href={lesson.content_url_or_text}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              Ouvrir le document <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        );

      case 'link':
        return (
          <div className="text-center py-12">
            <ExternalLink size={64} className="mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Ressource externe</h3>
            <a
              href={lesson.content_url_or_text}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              Accéder à la ressource <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        );

      default:
        return <p className="text-gray-500">Type de contenu non supporté</p>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
        <p className="text-gray-600 mt-1">
          Durée estimée : {lesson.estimated_duration_minutes} minutes
        </p>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default LessonViewer;
