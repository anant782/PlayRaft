
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-brand-text-secondary" />
      </div>
      <input
        type="text"
        placeholder="Search for games..."
        className="w-full pl-12 pr-4 py-3 bg-brand-card border border-brand-blue text-brand-text-primary placeholder:text-brand-text-secondary rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition duration-200 ease-in-out"
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search for games"
      />
    </div>
  );
};

export default SearchBar;
