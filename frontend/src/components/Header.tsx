import React from 'react';

import logoInfranet from '../assets/images/logoHFF.jpg'; 

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-infranet">
      
      {/* Le conteneur du Logo */}
      <div className="flex items-center">
        <img 
          src={logoInfranet} 
          alt="Logo Infranet" 
          className="h-12 w-auto object-contain" 
        />
      </div>

      <h1 className="text-2xl font-extrabold tracking-widest text-gray-800 uppercase italic">
        ANNUAIRE
      </h1>

    </header>
  );
};

export default Header;