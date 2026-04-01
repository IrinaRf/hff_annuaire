import React from 'react';
// On importe l'image comme un module (Vite s'occupe du chemin)
import logoInfranet from '../assets/images/logoHFF.jpg'; 

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-infranet">
      
      {/* Le conteneur du Logo */}
      <div className="flex items-center">
        <img 
          src={logoInfranet} 
          alt="Logo Infranet" 
          className="h-12 w-auto object-contain" // Garde la hauteur de 12 (comme ton ancien bloc)
        />
      </div>

      {/* Le Titre (inchangé car il est top) */}
      <h1 className="text-2xl font-extrabold tracking-widest text-gray-800 uppercase italic">
        ANNUAIRE
      </h1>

    </header>
  );
};

export default Header;