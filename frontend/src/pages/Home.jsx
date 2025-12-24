import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/Common/Button';

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="text-primary-600" size={32} />,
      title: 'Formations structurées',
      description: 'Des parcours de formation organisés en modules et leçons, avec vidéos, textes et exercices pratiques.'
    },
    {
      icon: <MessageSquare className="text-coral-500" size={32} />,
      title: 'Chatbot IA',
      description: 'Un assistant intelligent disponible 24h/24 pour répondre à vos questions et vous aider dans votre parcours.'
    },
    {
      icon: <Users className="text-green-600" size={32} />,
      title: 'Accompagnement',
      description: 'Des formateurs qualifiés vous accompagnent et vous donnent des retours personnalisés.'
    },
    {
      icon: <Award className="text-yellow-600" size={32} />,
      title: 'Certifications',
      description: 'Obtenez des certificats reconnus à la fin de chaque formation pour valoriser vos compétences.'
    }
  ];

  const stats = [
    { value: '10 000+', label: 'Apprenants' },
    { value: '150+', label: 'Formations' },
    { value: '95%', label: 'Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Votre avenir <span className="text-coral-400">professionnel</span><br />
              commence ici
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Développez les compétences recherchées par les employeurs. Formations certifiantes, 
              accompagnement personnalisé et chatbot IA pour vous guider.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" variant="coral" className="w-full sm:w-auto">
                  Explorer les formations <ArrowRight className="ml-2 inline" size={20} />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-900">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour <span className="text-primary-600">réussir</span>
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme complète pour votre insertion professionnelle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre carrière ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers d'apprenants et commencez votre formation dès aujourd'hui
          </p>
          <Link to="/register">
            <Button size="lg" variant="coral">
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
