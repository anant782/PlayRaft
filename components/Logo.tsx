
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-2 shadow-md flex items-center justify-center">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-2xl">
            P
        </div>
        <span className="ml-3 font-extrabold text-2xl text-gray-800">PlayRift</span>
    </div>
  );
};

export default Logo;
