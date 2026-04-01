import React from 'react';

const Footer: React.FC = () => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <footer className="mt-auto w-full bg-white border-t-2 border-black p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Ligne du haut : Entreprise à gauche, Utilisateur à droite */}
        <div className="flex justify-between items-start font-bold uppercase tracking-tight text-gray-800">
          <div>
            <span className="text-infranet text-xs block mb-1">Entreprise</span>
            <p className="text-lg">HENRI FRAISE & Cie</p>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-[10px] block mb-1 uppercase tracking-widest">Utilisateur actuel</span>
            <p className="text-sm border-b-2 border-infranet pb-1">Nom de l'utilisateur</p>
          </div>
        </div>

        {/* Ligne du milieu*/}
        <div className="pt-2">
          <p className="text-gray-500 font-medium italic text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-infranet rounded-full"></span>
            Service Informatique
          </p>
        </div>

        {/* Ligne du bas */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          <p>{currentDate}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;