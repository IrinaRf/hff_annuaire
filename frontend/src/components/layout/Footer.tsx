import React from 'react';

const Footer: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('fr-FR');

  return (
    <footer className="mt-auto w-full bg-white border-t-2 border-black p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Ligne du haut : Documentation à gauche */}
        <div className="flex justify-between items-start font-bold uppercase tracking-tight text-gray-800">
          <div>
            <p className="text-xl tracking-tighter uppercase italic">Documentation</p>
            <div className="mt-3 space-y-1 normal-case tracking-normal">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-infranet cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 bg-infranet rounded-full"></span>
                Documentation technique
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-infranet cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                Documents utilisateurs
              </div>
            </div>
          </div>
        </div>

        {/* Ligne du bas : Date affichée dynamiquement */}
        <div className="pt-4 border-t border-gray-100 items-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          <p>{currentDate}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;