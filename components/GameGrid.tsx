
import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onSelectGame }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
      {games.map(game => (
        <GameCard key={game.id} game={game} onSelectGame={onSelectGame} />
      ))}
    </div>
  );
};

export default GameGrid;
