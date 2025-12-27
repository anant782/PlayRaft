
import React, { useState, useEffect, useMemo } from 'react';
import { Game } from '../types';
import GameGrid from './GameGrid';
import SearchBar from './SearchBar';
import CloseIcon from './icons/CloseIcon';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

interface SearchViewProps {
  games: Game[];
  onClose: () => void;
  onSelectGame: (game: Game) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ games, onClose, onSelectGame }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredGames = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (term === '') return [];
    return games.filter(game =>
      game.title.toLowerCase().includes(term) ||
      (game.category && game.category.toLowerCase().includes(term))
    );
  }, [debouncedSearchTerm, games]);

  useEffect(() => {
    // Prevent background scroll when search is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-40 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center py-4 border-b">
          <div className="flex-grow">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Close search"
          >
            <CloseIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="py-8 h-[calc(100%-80px)] overflow-y-auto">
          {debouncedSearchTerm && (
            filteredGames.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-4">Results for "{debouncedSearchTerm}"</h2>
                <GameGrid games={filteredGames} onSelectGame={onSelectGame} />
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl font-semibold text-gray-600">No games found for "{debouncedSearchTerm}"</p>
                <p className="mt-2 text-gray-400">Try searching for something else!</p>
              </div>
            )
          )}
          {!debouncedSearchTerm && (
             <div className="text-center py-16">
                <p className="text-2xl font-semibold text-gray-600">Search for your favorite games</p>
                <p className="mt-2 text-gray-400">Find something fun to play!</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
