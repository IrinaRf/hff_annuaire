import React, { useState } from 'react';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  onSearchChange: (user: string, location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState("");
  const [loc, setLoc] = useState("");

  const handleClear = () => {
    setUser("");
    setLoc("");
    onSearchChange("", "");
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden text-left transition-all duration-300">
      
      {/* 1. BANDEAU DE TITRE */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-infranet p-3 flex justify-between items-center cursor-pointer hover:brightness-95 transition-all"
      >
        <div className="flex items-center gap-2">
          <Search size={16} strokeWidth={2.5} className="text-gray-800" />
          <h2 className="font-bold uppercase tracking-tight text-xs text-gray-800">
            Formulaire de recherche
          </h2>
        </div>
        {/* Rotation de l'icône selon l'état */}
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
        />
      </div>

      {/* 2. CONTENU DU FORMULAIRE AVEC ANIMATION SMOOTH */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Champ Utilisateur */}
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5 text-gray-500">
                Utilisateur
              </label>
              <input 
                type="text" 
                value={user}
                placeholder="Rechercher un nom..." 
                className="w-full border border-gray-300 rounded-sm p-2 focus:border-infranet focus:ring-1 focus:ring-infranet outline-none transition-all text-sm"
                onChange={(e) => {
                  setUser(e.target.value);
                  onSearchChange(e.target.value, loc);
                }} 
              />
            </div>

            {/* Champ Localisation */}
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5 text-gray-500">
                Localisation
              </label>
              <input 
                type="text" 
                value={loc}
                placeholder="Ville, site..." 
                className="w-full border border-gray-300 rounded-sm p-2 focus:border-infranet focus:ring-1 focus:ring-infranet outline-none transition-all text-sm"
                onChange={(e) => {
                  setLoc(e.target.value);
                  onSearchChange(user, e.target.value);
                }}
              />
            </div>
          </div>

          {/* 3. BARRE D'ACTIONS */}
          <div className="flex justify-end items-center pt-4 border-t border-gray-100 gap-2">
            <button 
              onClick={handleClear}
              className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-sm font-bold text-[11px] transition-colors shadow-sm"
            >
              <RotateCcw size={14} /> EFFACER
            </button>

            <button className="flex items-center justify-center gap-2 bg-infranet hover:bg-[#e5ac00] text-gray-800 px-6 py-2 rounded-sm font-black text-[11px] transition-colors shadow-sm uppercase">
              <Search size={14} strokeWidth={2.5} />
              Recherche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;