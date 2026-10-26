import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  Menu, 
  X, 
  BookOpen, 
  GraduationCap,
  User,
  LogIn,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../../context/AuthContext";

const Navbar = ({ scrollToContact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { href: "/courses", label: "Catalogue", icon: BookOpen },
    { href: "/About", label: "À propos", icon: null },
    { href: "#contact", label: "Contact", icon: null, scroll:true},
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky m top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-400 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">FormaPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => {
                    if (link.scroll) {
                        scrollToContact();  // ← Utilise la prop
                    }
                  }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}
            
            {/* Liens supplémentaires pour utilisateurs authentifiés */}
            {isAuthenticated && (
              <>
                {user?.role === 'TRAINEE' && (
                  <Link
                    to="/my-courses"
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive("/my-courses") ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Mes Cours
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 hidden group-hover:block">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    Mon Profil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                </Button>
                <Button variant="coral" asChild>
                  <Link to="/register">
                    <User className="w-4 h-4" />
                    S'inscrire
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.href) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Liens supplémentaires pour mobile si authentifié */}
              {isAuthenticated && (
                <>
                  {user?.role === 'TRAINEE' && (
                    <Link
                      to="/my-courses"
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive("/my-courses") 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-accent"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Mes Cours
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive("/dashboard") 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              
              <div className="flex flex-col gap-2 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <User className="w-4 h-4" />
                        Mon Profil
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full">
                      <Link to="/login">Connexion</Link>
                    </Button>
                    <Button variant="coral" asChild className="w-full">
                      <Link to="/register">S'inscrire</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;