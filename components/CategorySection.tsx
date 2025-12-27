
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Game } from '../types';
import GameCard from './GameCard';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface CategorySectionProps {
  title: string;
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, games, onSelectGame }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollability = useCallback(() => {
    const el = scrollerRef.current;
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) {
      checkForScrollability();
      el.addEventListener('scroll', checkForScrollability, { passive: true });
      const resizeObserver = new ResizeObserver(checkForScrollability);
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener('scroll', checkForScrollability);
        resizeObserver.unobserve(el);
      };
    }
  }, [games, checkForScrollability]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative group">
      <h2 className="text-2xl font-bold mb-4 text-white">{title} Games</h2>
      
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-8 z-10 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 -ml-4"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
        </button>
      )}

      <div
        ref={scrollerRef}
        className="flex space-x-4 overflow-x-auto pb-4 -mb-4 scrollbar-hide"
      >
        {games.slice(0, 15).map(game => (
          <div key={game.id} className="w-48 sm:w-56 flex-shrink-0">
            <GameCard game={game} onSelectGame={onSelectGame} />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-8 z-10 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 -mr-4"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      )}
    </section>
  );
};

export default CategorySection;
