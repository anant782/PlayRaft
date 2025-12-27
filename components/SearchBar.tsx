
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search for games..."
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200 ease-in-out"
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search for games"
      />
    </div>
  );
};

export default SearchBar;
