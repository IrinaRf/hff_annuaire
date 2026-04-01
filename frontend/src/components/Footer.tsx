import React from 'react';

const Footer: React.FC = () => {
  // On récupère l'année dynamiquement pour ne pas avoir à la changer tous les ans !
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 text-center text-gray-400 text-sm border-t border-gray-200 bg-white/50 w-full">
      <div className="flex flex-col items-center gap-1">
        <p className="font-medium">
          © {currentYear} — <span className="text-infranet uppercase tracking-widest">Infranet</span>
        </p>
        <p className="italic text-xs text-gray-300 uppercase">
          Annuaire Interne • Test en local
        </p>
      </div>
    </footer>
  );
};

export default Footer;