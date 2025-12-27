
import React from 'react';
import { Game } from '../types';
import CloseIcon from './icons/CloseIcon';

interface GameViewProps {
  game: Game;
  onClose: () => void;
}

const GameView: React.FC<GameViewProps> = ({ game, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full h-full max-w-6xl aspect-video bg-gray-900 rounded-lg shadow-2xl">
        <div className="absolute top-0 left-0 right-0 p-3 bg-gray-800 rounded-t-lg flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">{game.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white bg-gray-700 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
            aria-label="Close game"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <iframe
          src={game.gameUrl}
          title={game.title}
          className="w-full h-full pt-14 rounded-b-lg"
          allow="fullscreen"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default GameView;
