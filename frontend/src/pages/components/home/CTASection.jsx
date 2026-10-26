import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background avec gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: "linear-gradient(135deg, hsl(220, 70%, 45%) 0%, hsl(220, 60%, 35%) 50%, hsl(175, 60%, 45%) 100%)"
        }}
      />
      
      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ 
            background: "radial-gradient(circle, hsl(18, 85%, 60%) 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ 
            background: "radial-gradient(circle, hsl(175, 60%, 45%) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Pattern de grille */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge avec sparkles */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Commencez gratuitement
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Prêt à transformer votre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
              carrière
            </span>{" "}
            ?
          </h2>

          {/* Description */}
          <p className="text-xl text-white/90 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Rejoignez plus de 10 000 apprenants qui ont déjà franchi le pas. 
            Inscrivez-vous aujourd'hui et accédez à toutes nos formations.
          </p>
          
          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button 
              size="xl" 
              variant="secondary"
              className="shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link to="/register">
                Commencer maintenant 
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="xl" 
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm shadow-xl hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link to="/courses">
                Parcourir le catalogue
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70 text-sm animate-in fade-in zoom-in duration-700 delay-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Accès immédiat</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Satisfait ou remboursé</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
