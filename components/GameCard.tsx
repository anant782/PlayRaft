
import React from 'react';
import { Game } from '../types';

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
      <div className="w-full h-full overflow-hidden rounded-2xl bg-gray-200 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
        <img 
          src={game.thumbnailUrl} 
          alt={game.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      {showTitle && (
        <h3 className="mt-2 text-sm font-semibold text-white truncate transition-colors duration-300 group-hover:text-gray-200">
          {game.title}
        </h3>
      )}
    </div>
  );
};

export default GameCard;
