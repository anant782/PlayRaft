
import React from 'react';

interface LogoProps {
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-brand-card rounded-2xl p-2 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow"
      onClick={onClick}
    >
        <img 
          src="https://github.com/anant782/Logo/blob/main/favicon.png?raw=true" 
          alt="PlayRaft Logo" 
          className="w-10 h-10 rounded-lg"
        />
        <span className="ml-3 font-extrabold text-2xl text-brand-text-primary">PlayRaft</span>
    </div>
  );
};

export default Logo;