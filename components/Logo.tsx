
import React from 'react';

interface LogoProps {
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-brand-card rounded-2xl p-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
    >
        <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-brand-dark text-2xl">
            P
        </div>
        <span className="ml-3 font-extrabold text-2xl text-brand-text-primary">PlayRaft</span>
    </div>
  );
};

export default Logo;
