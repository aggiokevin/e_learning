import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            À Propos de <span className="text-primary">FormaPro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Votre plateforme dédiée à l'insertion professionnelle et au développement des compétences.
          </p>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Notre Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              FormaPro a pour mission de fournir des formations de qualité accessibles à tous, 
              afin de faciliter l'insertion professionnelle et le développement des compétences. 
              Nous accompagnons chaque apprenant dans son parcours vers la réussite.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Excellence</h3>
              <p className="text-muted-foreground text-sm">
                Des formations de qualité pour votre réussite.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Accessibilité</h3>
              <p className="text-muted-foreground text-sm">
                L'éducation pour tous, partout.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground text-sm">
                Des outils modernes et un chatbot IA.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Accompagnement</h3>
              <p className="text-muted-foreground text-sm">
                Un suivi personnalisé pour chaque apprenant.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="container mx-auto px-4 text-center">
          <div className="bg-primary/5 rounded-2xl p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Une question ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Notre équipe est là pour vous accompagner.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Contactez-nous
            </a>
          </div>
        </section>
      </main>

    </div>
  );
};

export default About;
