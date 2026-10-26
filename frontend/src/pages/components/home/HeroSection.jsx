import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, Play, Users, BookOpen, Award } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "10 000+", label: "Apprenants" },
    { icon: BookOpen, value: "150+", label: "Formations" },
    { icon: Award, value: "95%", label: "Taux de réussite" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background avec gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: "linear-gradient(135deg, hsl(220, 70%, 45%) 0%, hsl(220, 60%, 35%) 50%, hsl(220, 70%, 30%) 100%)"
        }}
      />
      
      {/* Éléments décoratifs animés avec blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse-soft"
          style={{ 
            background: "radial-gradient(circle, hsl(220, 70%, 55%) 0%, transparent 70%)",
            animation: "pulse-soft 4s ease-in-out infinite"
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-30 animate-pulse-soft"
          style={{ 
            background: "radial-gradient(circle, hsl(175, 60%, 45%) 0%, transparent 70%)",
            animation: "pulse-soft 4s ease-in-out infinite 1s"
          }}
        />
        <div 
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse-soft"
          style={{ 
            background: "radial-gradient(circle, hsl(18, 85%, 60%) 0%, transparent 70%)",
            animation: "pulse-soft 4s ease-in-out infinite 2s"
          }}
        />
      </div>

      {/* Pattern de grille en overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Contenu principal */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Colonne gauche - Texte */}
          <div className="space-y-8">
            {/* Badge animé */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                🎓 Plus de 10 000 apprenants nous font confiance
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Votre avenir
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                professionnel
              </span>
              <br />
              commence ici
            </h1>

            {/* Description */}
            <p className="text-xl text-white/90 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Développez les compétences recherchées par les employeurs. 
              Formations certifiantes, accompagnement personnalisé et chatbot IA pour vous guider.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button 
                size="xl" 
                variant="secondary"
                className="shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/courses">
                  Explorer les formations 
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="xl" 
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Play className="w-5 h-5" /> 
                <Link to="/about" className="ml-2">
                Voir la présentation
                </Link>
              </Button>
            </div>
            
            {/* Statistiques */}
            {/* <div className="flex flex-wrap gap-8 pt-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                      <Icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div> */}
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/10 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-secondary" />
                    <span className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-primary-foreground/60 text-sm">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              {/* Main card */}
              <div className="glass-card rounded-2xl p-6 space-y-4 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Développement Web</h3>
                    <p className="text-sm text-muted-foreground">12 modules • 40h</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-semibold text-success">75%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 glass-card rounded-xl p-4 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Certificat obtenu</p>
                    <p className="font-semibold text-sm text-foreground">Marketing Digital</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card rounded-xl p-4 animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium"
                        style={{ 
                          backgroundColor: `hsl(${(i * 60) % 360} 70% 85%)`,
                        }}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">+2 340</p>
                    <p className="text-xs text-muted-foreground">cette semaine</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
