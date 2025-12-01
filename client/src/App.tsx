import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SearchPage from "@/pages/search";
import BatchDownload from "@/pages/batch-download";
import MassAnalysis from "@/pages/mass-analysis";
import KeywordSearch from "@/pages/keyword-search";
import { Home as HomeIcon, Search, Download, BarChart3, Hash, Menu, X } from "lucide-react";
import { BackgroundUploader } from "@/components/background-uploader";
import { Fireworks } from "@/components/fireworks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Inicio", icon: HomeIcon, color: "cyan" },
  { href: "/search", label: "Buscar", icon: Search, color: "purple" },
  { href: "/batch", label: "Descarga Múltiple", icon: Download, color: "green" },
  { href: "/keyword", label: "Palabras Clave", icon: Hash, color: "pink" },
  { href: "/analysis", label: "Análisis", icon: BarChart3, color: "orange" },
];

function Router() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavItemClass = (isActive: boolean, color: string) => {
    const colorClasses: Record<string, { active: string; inactive: string }> = {
      cyan: {
        active: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
        inactive: "text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10 border-transparent"
      },
      purple: {
        active: "bg-purple-500/20 text-purple-300 border-purple-500/50",
        inactive: "text-purple-400/60 hover:text-purple-300 hover:bg-purple-500/10 border-transparent"
      },
      green: {
        active: "bg-green-500/20 text-green-300 border-green-500/50",
        inactive: "text-green-400/60 hover:text-green-300 hover:bg-green-500/10 border-transparent"
      },
      pink: {
        active: "bg-pink-500/20 text-pink-300 border-pink-500/50",
        inactive: "text-pink-400/60 hover:text-pink-300 hover:bg-pink-500/10 border-transparent"
      },
      orange: {
        active: "bg-orange-500/20 text-orange-300 border-orange-500/50",
        inactive: "text-orange-400/60 hover:text-orange-300 hover:bg-orange-500/10 border-transparent"
      },
      blue: {
        active: "bg-blue-500/20 text-blue-300 border-blue-500/50",
        inactive: "text-blue-400/60 hover:text-blue-300 hover:bg-blue-500/10 border-transparent"
      },
    };
    return `flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-lg transition-all whitespace-nowrap border ${
      isActive ? colorClasses[color].active : colorClasses[color].inactive
    }`;
  };
  
  return (
    <>
      {/* Header */}
      <nav className="relative z-20 bg-black/50 backdrop-blur-md border-b border-cyan-500/20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Hamburger menu - solo en móvil */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Desktop menu - solo en escritorio */}
            <div className="hidden md:flex items-center justify-center gap-2 md:gap-4 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getNavItemClass(location === item.href, item.color)}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Botón de fondo - siempre visible */}
            <div className="ml-auto">
              <BackgroundUploader />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-black/90 backdrop-blur-md border-r border-cyan-500/20 overflow-y-auto">
            <div className="space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${getNavItemClass(location === item.href, item.color)}`}
                  data-testid={`nav-mobile-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/search" component={SearchPage}/>
        <Route path="/batch" component={BatchDownload}/>
        <Route path="/keyword" component={KeywordSearch}/>
        <Route path="/analysis" component={MassAnalysis}/>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    const bg = localStorage.getItem('backgroundImage');
    if (bg) {
      setBackgroundUrl(bg);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-cyan-950/20"
        style={
          backgroundUrl
            ? {
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
              }
            : {}
        }
      >
        {/* Contenido relativo */}
        <div className="relative z-10">
          <Router />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
