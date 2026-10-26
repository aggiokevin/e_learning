import { 
  BookOpen, 
  MessageSquare,  // ← Changé de MessageSquareText à MessageSquare
  Award, 
  Users, 
  BarChart3, 
  Sparkles 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Formations structurées",
      description: "Des parcours de formation organisés en modules et leçons, avec vidéos, textes et exercices pratiques.",
      color: "primary",
    },
    {
      icon: MessageSquare,  // ← Changé ici aussi
      title: "Chatbot IA",
      description: "Un assistant intelligent disponible 24h/24 pour répondre à vos questions et vous aider dans votre parcours.",
      color: "accent",
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Obtenez des certificats reconnus à la fin de chaque formation pour valoriser vos compétences.",
      color: "secondary",
    },
    {
      icon: Users,
      title: "Accompagnement",
      description: "Des formateurs qualifiés vous accompagnent et vous donnent des retours personnalisés.",
      color: "success",
    },
    {
      icon: BarChart3,
      title: "Suivi de progression",
      description: "Visualisez votre avancement et atteignez vos objectifs avec notre système de suivi détaillé.",
      color: "primary",
    },
    {
      icon: Sparkles,
      title: "Contenu actualisé",
      description: "Des formations régulièrement mises à jour pour coller aux besoins du marché du travail.",
      color: "accent",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">
            Une plateforme complète pour votre réussite
          </h2>
          <p className="text-lg text-muted-foreground">
            Tous les outils dont vous avez besoin pour développer vos compétences et décrocher l'emploi de vos rêves.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-card p-8 rounded-xl shadow-soft hover:shadow-medium transition-shadow">
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
