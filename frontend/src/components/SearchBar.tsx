import React from 'react';
// On importe les icônes (n'oublie pas : npm install lucide-react)
import { Search, FileSpreadsheet } from 'lucide-react';

interface SearchBarProps {
  // On adapte les props pour gérer les deux champs
  onSearchChange: (user: string, location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  return (
    <div className="bg-white border-2 border-black p-4 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      
      {/* 1. Champ Utilisateur (Nom / Prénom) */}
      <div className="flex-1 w-full text-left">
        <label className="block text-[10px] font-black uppercase mb-1 text-gray-500 tracking-wider">
          Utilisateur :
        </label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Rechercher un nom..." 
            className="w-full border-2 border-gray-200 p-2 focus:border-infranet outline-none transition-colors"
            onChange={(e) => onSearchChange(e.target.value, "")} 
          />
        </div>
      </div>

      {/* 2. Champ Localisation */}
      <div className="flex-1 w-full text-left">
        <label className="block text-[10px] font-black uppercase mb-1 text-gray-500 tracking-wider">
          Localisation :
        </label>
        <input 
          type="text" 
          placeholder="Ville, site..." 
          className="w-full border-2 border-gray-200 p-2 focus:border-infranet outline-none transition-colors"
        />
      </div>

      {/* 3. Les Boutons d'action */}
      <div className="flex gap-2 h-11 w-full md:w-auto">
        <button className="flex-1 md:flex-none bg-infranet hover:bg-[#e5ac00] px-6 flex items-center justify-center gap-2 font-bold transition-all shadow-sm">
          <Search size={18} strokeWidth={3} />
          <span className="text-sm">RECHERCHER</span>
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 flex items-center justify-center gap-2 font-bold transition-all shadow-sm">
          <FileSpreadsheet size={18} />
          <span className="hidden lg:inline text-sm italic">XLS</span>
        </button>
      </div>

    </div>
  );
};

export default SearchBar;