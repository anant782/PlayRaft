
import React from 'react';
import { Game } from '../types';
import PlayIcon from './icons/PlayIcon';

interface GameCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
  className?: string;
  showTitle?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelectGame, className = '', showTitle = true }) => {
  return (
    <div 
      className={`group cursor-pointer ${className}`}
      onClick={() => onSelectGame(game)}
      onKeyPress={(e) => e.key === 'Enter' && onSelectGame(game)}
      tabIndex={0}
      aria-label={`Play ${game.title}`}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-brand-card shadow-lg transition-all duration-300 group-hover:shadow-glow group-hover:scale-105">
        <img 
          src={game.thumbnailUrl} 
          alt={game.title} 
          className="w-full h-full object-cover transition-all duration-300 group-hover:filter group-hover:brightness-50" 
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-full flex items-center gap-2 transform group-hover:scale-100 scale-90 transition-transform duration-300 pointer-events-none">
             <PlayIcon className="w-5 h-5" />
             <span>Play Now</span>
          </div>
        </div>
      </div>
      {showTitle && (
        <h3 className="mt-2 text-sm font-semibold text-brand-text-primary truncate transition-colors duration-300 group-hover:text-brand-accent">
          {game.title}
        </h3>
      )}
    </div>
  );
};

export default GameCard;
