
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="bg-brand-card rounded-2xl p-2 shadow-lg flex items-center justify-center">
        <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-brand-dark text-2xl">
            P
        </div>
        <span className="ml-3 font-extrabold text-2xl text-brand-text-primary">PlayRaft</span>
    </div>
  );
};

export default Logo;
