
import React, { useState, useEffect, useRef } from 'react';
import { Game } from '../types';
import CloseIcon from './icons/CloseIcon';
import FullscreenIcon from './icons/FullscreenIcon';
import PlayIcon from './icons/PlayIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GameViewProps {
  game: Game;
  onClose: () => void;
}

const GameView: React.FC<GameViewProps> = ({ game, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const originalTitle = document.title;
    if (game?.title) {
      document.title = `${game.title} - Play Free Online on PlayRaft`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [game?.title]);

  const handleFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    
    try {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen not supported or blocked', e);
    }
  };

  if (!game) return null;

  return (
    <div className="animate-fade-in pb-12">
      {/* Navigation & Header */}
      <nav className="flex items-center justify-between mb-8">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-accent transition-colors font-semibold group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </button>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-xs font-bold rounded-full border border-brand-accent/20">
            {game.category || 'Game'}
          </span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Game Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="relative aspect-video w-full bg-brand-card rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img 
                  src={game.thumbnailUrl || ''} 
                  alt={game.title || 'Game'} 
                  className="absolute inset-0 w-full h-full object-cover blur-[2px] opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-80" />
                
                <div className="relative z-10 text-center px-6">
                  <h1 className="text-4xl sm:text-6xl font-black text-brand-text-primary mb-8 drop-shadow-xl">
                    {game.title}
                  </h1>
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="group/btn relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-brand-accent to-blue-500 group-hover:from-brand-accent group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
                  >
                    <span className="relative px-12 py-5 transition-all ease-in duration-75 bg-brand-dark rounded-full group-hover/btn:bg-opacity-0 flex items-center gap-3 text-xl font-bold">
                      <PlayIcon className="w-8 h-8 text-brand-accent group-hover/btn:text-white" />
                      Play Now
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-black relative">
                <iframe
                  ref={iframeRef}
                  src={game.gameUrl}
                  title={game.title}
                  className="w-full h-full border-0"
                  allow="fullscreen; autoplay; gamepad"
                ></iframe>
                <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                   <button 
                    onClick={handleFullscreen}
                    className="p-3 bg-brand-dark/80 backdrop-blur-md rounded-xl text-brand-text-primary hover:bg-brand-accent hover:text-brand-dark transition-all shadow-xl"
                    title="Fullscreen"
                   >
                     <FullscreenIcon className="w-6 h-6" />
                   </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-brand-card/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">About {game.title}</h2>
            <p className="text-brand-text-secondary leading-relaxed text-lg">
              {game.description || `Play ${game.title} online for free! Enjoy high-quality gameplay directly in your browser.`}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Platform</span>
                  <span className="text-brand-text-primary font-medium">Web Browser</span>
               </div>
               <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Category</span>
                  <span className="text-brand-text-primary font-medium">{game.category || 'General'}</span>
               </div>
               <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Rating</span>
                  <span className="text-brand-accent font-bold">★★★★★ 4.8/5</span>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-brand-card/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                Play More
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-brand-text-secondary">
                  Love <strong>{game.title}</strong>? We've got hundreds of other free online games ready for you to explore!
                </p>
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-white/5 hover:bg-brand-accent/10 border border-white/10 hover:border-brand-accent/30 text-brand-text-primary rounded-xl transition-all font-bold"
                >
                  Explore Catalog
                </button>
              </div>
           </div>
           
           <div className="rounded-3xl overflow-hidden border border-white/10">
              <img 
                src={game.thumbnailUrl || ''} 
                alt="Game Banner" 
                className="w-full object-cover"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default GameView;
