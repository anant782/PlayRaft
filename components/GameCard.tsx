
import React from 'react';
import { Game } from '../types';
import PlayIcon from './icons/PlayIcon';

interface GameCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
  className?: string;
  showTitle?: boolean;
  isFeatured?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelectGame, className = '', showTitle = true, isFeatured = false }) => {
  return (
    <div 
      className={`group cursor-pointer ${className}`}
      onClick={() => onSelectGame(game)}
      onKeyPress={(e) => e.key === 'Enter' && onSelectGame(game)}
      tabIndex={0}
      aria-label={`Play ${game?.title || 'Game'}`}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-brand-card shadow-lg transition-all duration-300 group-hover:shadow-glow-lg group-hover:-translate-y-1 border border-white/10">
        <img 
          src={game?.thumbnailUrl || ''} 
          alt={game?.title ? `Cover art for ${game.title}` : 'Game thumbnail'} 
          loading={isFeatured ? 'eager' : 'lazy'}
          fetchpriority={isFeatured ? 'high' : 'auto'}
          width="512"
          height="288"
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75" 
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <div className="bg-brand-accent text-brand-dark font-black py-2 px-5 rounded-full flex items-center gap-2 transform group-hover:scale-100 scale-90 transition-transform duration-300 ease-out shadow-xl">
             <PlayIcon className="w-5 h-5" />
             <span className="text-xs uppercase tracking-tighter">Play Now</span>
          </div>
        </div>
      </div>
      {showTitle && (
        <h3 className="mt-3 text-sm font-bold text-brand-text-primary truncate transition-colors duration-300 group-hover:text-brand-accent px-1">
          {game?.title || 'Untitled'}
        </h3>
      )}
    </div>
  );
};

export default GameCard;
