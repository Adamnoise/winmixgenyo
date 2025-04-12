
import React, { useState, useEffect, useCallback } from 'react';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import MatchCard from './MatchCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  badge?: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  showStats?: boolean;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Emeld új szintre',
      subtitle: 'mérkőzés tippjeidet',
      badge: 'Tippelj mérkőzésekre és nyerj jutalmakat',
      primaryButton: {
        text: 'Kezdj el tippelni most',
        link: '/signup'
      },
      secondaryButton: {
        text: 'Hogyan működik',
        link: '/how-it-works'
      },
      showStats: true,
      content: (
        <div className="relative h-[500px] w-[500px] max-w-full">
          {/* Background Blobs/Circles */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-purple-500/15 blur-3xl animate-pulse-subtle"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5 animate-float" style={{ animationDuration: '15s' }}></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-blue-500/10 animate-float" style={{ animationDuration: '20s', animationDelay: '0.5s' }}></div>

          {/* The Card Itself */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MatchCard 
              homeTeam={{
                name: 'Arsenal',
                logo: 'https://media.api-sports.io/football/teams/42.png',
                type: 'Hazai'
              }}
              awayTeam={{
                name: 'Chelsea',
                logo: 'https://media.api-sports.io/football/teams/49.png',
                type: 'Vendég'
              }}
              time="21:00"
              isLive={true}
            />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Értékes elemzések',
      subtitle: 'profi áttekintéssel',
      badge: 'Használj adatokat a jobb döntésekhez',
      primaryButton: {
        text: 'Elemzések megtekintése',
        link: '/analysis'
      },
      secondaryButton: {
        text: 'Ingyenes elemzések',
        link: '/free-analysis'
      },
      showStats: false,
      content: (
        <div className="relative h-[500px] w-[500px] max-w-full">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 blur-xl"></div>
          <div className="p-4 backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-gray-900/80 border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-4">Professzionális adatelemzés</h3>
            <p className="text-sm text-gray-300 mb-4">Áttekinthető adatok és grafikonok segítségével jobb döntéseket hozhatsz a mérkőzés kimenetelével kapcsolatban.</p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">Birtoklás</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-400">54%</span>
                    <span className="text-xs text-gray-400">46%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">Lövések</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-400">12</span>
                    <span className="text-xs text-gray-400">8</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">Kapura lövések</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-400">5</span>
                    <span className="text-xs text-gray-400">3</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '62.5%' }}></div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">Szögletek</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-400">7</span>
                    <span className="text-xs text-gray-400">4</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '63.6%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Real-time statisztikák',
      subtitle: 'a jobb döntésekhez',
      badge: 'A legjobb odds-ok és statisztikák',
      primaryButton: {
        text: 'Mérkőzések böngészése',
        link: '/matches'
      },
      secondaryButton: {
        text: 'Lássuk a statisztikákat',
        link: '/stats'
      },
      showStats: true,
      content: (
        <div className="relative h-[500px] w-[500px] max-w-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-purple-500/15 blur-3xl animate-pulse-subtle"></div>
          <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-gray-900/80 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Bajnokság legjobb csapatai</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">1.</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 p-1 flex items-center justify-center">
                      <img src="https://media.api-sports.io/football/teams/42.png" alt="Arsenal logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-sm font-medium text-white">Arsenal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-400">D</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                  </div>
                  <span className="text-sm font-medium text-white">88 pont</span>
                </div>
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">2.</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 p-1 flex items-center justify-center">
                      <img src="https://media.api-sports.io/football/teams/50.png" alt="Manchester City logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-sm font-medium text-white">Man City</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-400">D</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                  </div>
                  <span className="text-sm font-medium text-white">85 pont</span>
                </div>
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">3.</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 p-1 flex items-center justify-center">
                      <img src="https://media.api-sports.io/football/teams/40.png" alt="Liverpool logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-sm font-medium text-white">Liverpool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">L</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">W</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-400">D</span>
                  </div>
                  <span className="text-sm font-medium text-white">79 pont</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto switch slides
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAnimating) {
        goToNextSlide();
      }
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [currentSlide, isAnimating, goToNextSlide, goToPrevSlide]);
  
  const goToPrevSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);}, [isAnimating, slides.length]);

  const goToNextSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  }, [isAnimating, slides.length]);

  const goToSlide = (index: number) => {
    if (isAnimating || currentSlide === index) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

    return (
    <section id="hero" className="relative">
      <div className="relative min-h-[80vh] flex items-center pt-28 pb-16 overflow-hidden">
        <HeroBackground />
        
        {/* Carousel Controls */}
        <button 
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/30 transition-colors duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button 
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/30 transition-colors duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Current Slide */}
        <div className="w-full" key={currentSlide}>
          <HeroContent
            title={slides[currentSlide].title}
            subtitle={slides[currentSlide].subtitle}
            badge={slides[currentSlide].badge}
            primaryButton={slides[currentSlide].primaryButton}
            secondaryButton={slides[currentSlide].secondaryButton}
            stats={slides[currentSlide].showStats}
          >
            {slides[currentSlide].content}
          </HeroContent>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
