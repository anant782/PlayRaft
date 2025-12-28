
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
  'lg:col-span-2 lg:row-span-2', // 1. Large
  'lg:col-span-1 lg:row-span-1', // 2. Small
  'lg:col-span-1 lg:row-span-1', // 3. Small
  'lg:col-span-2 lg:row-span-1', // 4. Medium
  'lg:col-span-1 lg:row-span-1', // 5. Small
  'lg:col-span-1 lg:row-span-1', // 6. Small
  'lg:col-span-1 lg:row-span-1', // 7. Small
  'lg:col-span-1 lg:row-span-1', // 8. Small
  'lg:col-span-2 lg:row-span-2', // 9. Large
  'lg:col-span-1 lg:row-span-1', // 10. Small
  'lg:col-span-1 lg:row-span-1', // 11. Small
  'lg:col-span-2 lg:row-span-1', // 12. Medium
  'lg:col-span-2 lg:row-span-1', // 13. Medium
  'lg:col-span-1 lg:row-span-1', // 14. Small
  'lg:col-span-1 lg:row-span-1', // 15. Small
  'lg:col-span-2 lg:row-span-2', // 16. Large
  'lg:col-span-1 lg:row-span-1', // 17. Small
  'lg:col-span-1 lg:row-span-1', // 18. Small
  'lg:col-span-2 lg:row-span-1', // 19. Medium
  'lg:col-span-1 lg:row-span-1', // 20. Small
];

const MosaicGameGrid: React.FC<MosaicGameGridProps> = ({ games, onSelectGame }) => {
  if (!games || games.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
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
