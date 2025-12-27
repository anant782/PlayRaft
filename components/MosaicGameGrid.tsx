
import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface MosaicGameGridProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

// A new, longer, and more irregular layout pattern for a 6-column grid.
// This creates a much more dynamic and visually appealing mosaic with high contrast.
const layoutClasses = [
  'sm:col-span-2 sm:row-span-2', // 1. Large
  'sm:col-span-1 sm:row-span-1', // 2. Small
  'sm:col-span-1 sm:row-span-1', // 3. Small
  'sm:col-span-2 sm:row-span-1', // 4. Medium
  'sm:col-span-1 sm:row-span-1', // 5. Small
  'sm:col-span-1 sm:row-span-1', // 6. Small
  'sm:col-span-1 sm:row-span-1', // 7. Small
  'sm:col-span-1 sm:row-span-1', // 8. Small
  'sm:col-span-2 sm:row-span-2', // 9. Large
  'sm:col-span-1 sm:row-span-1', // 10. Small
  'sm:col-span-1 sm:row-span-1', // 11. Small
  'sm:col-span-2 sm:row-span-1', // 12. Medium
  'sm:col-span-2 sm:row-span-1', // 13. Medium
  'sm:col-span-1 sm:row-span-1', // 14. Small
  'sm:col-span-1 sm:row-span-1', // 15. Small
  'sm:col-span-2 sm:row-span-2', // 16. Large
  'sm:col-span-1 sm:row-span-1', // 17. Small
  'sm:col-span-1 sm:row-span-1', // 18. Small
  'sm:col-span-2 sm:row-span-1', // 19. Medium
  'sm:col-span-1 sm:row-span-1', // 20. Small
];

const MosaicGameGrid: React.FC<MosaicGameGridProps> = ({ games, onSelectGame }) => {
  if (!games || games.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-6">
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          onSelectGame={onSelectGame}
          className={layoutClasses[index % layoutClasses.length]}
          showTitle={false}
        />
      ))}
    </div>
  );
};

export default MosaicGameGrid;
