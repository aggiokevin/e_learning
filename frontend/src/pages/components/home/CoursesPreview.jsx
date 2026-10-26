import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, Clock, Users, Star, BookOpen } from "lucide-react";

const CoursesPreview = () => {
  const courses = [
    {
      id: 1,
      title: "Développement Web Full Stack",
      description: "Maîtrisez HTML, CSS, JavaScript, React et Node.js pour devenir développeur web.",
      category: "Développement",
      level: "Débutant",
      duration: "40h",
      students: 1250,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      color: "primary",
    },
    {
      id: 2,
      title: "Marketing Digital",
      description: "Apprenez les stratégies de marketing en ligne, SEO, réseaux sociaux et publicité.",
      category: "Marketing",
      level: "Intermédiaire",
      duration: "25h",
      students: 890,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      color: "secondary",
    },
    {
      id: 3,
      title: "Excel Avancé & Data Analysis",
      description: "Devenez expert Excel avec les tableaux croisés, VBA et l'analyse de données.",
      category: "Bureautique",
      level: "Avancé",
      duration: "30h",
      students: 650,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      color: "accent",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4">
              Formations populaires
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez nos cours les plus appréciés
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/courses">
              Voir tout le catalogue <ArrowRight />
            </Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 bg-${course.color} text-${course.color}-foreground rounded-full text-sm font-medium`}>
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="px-2 py-1 bg-muted rounded">{course.level}</span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{course.title}</h3>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
