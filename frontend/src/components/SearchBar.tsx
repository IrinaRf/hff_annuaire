import React, { useState } from 'react';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  // L'interface pour les props du SearchBar, avec une fonction de rappel pour les changements de recherche
  onSearchChange: (user: string, location: string, email: string, functionTitle: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // 1. États pour les 4 champs
  const [user, setUser] = useState("");
  const [loc, setLoc] = useState("");
  const [email, setEmail] = useState("");
  const [func, setFunc] = useState("");

  // Fonction pour tout effacer d'un coup
  const handleClear = () => {
    setUser("");
    setLoc("");
    setEmail("");
    setFunc("");
    onSearchChange("", "", "", "");
  };

  // Fonction pour déclencher la recherche à chaque frappe
  const handleChange = (newUser: string, newLoc: string, newEmail: string, newFunc: string) => {
    onSearchChange(newUser, newLoc, newEmail, newFunc);
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
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
        />
      </div>

      {/* 2. CONTENU DU FORMULAIRE */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 space-y-5">
          
          {/* GRILLE À 4 COLONNES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Champ Utilisateur */}
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1.5 text-gray-500 tracking-wider">Utilisateur</label>
              <input 
                type="text" value={user} placeholder="Nom, prénom..." 
                className="w-full border border-gray-300 rounded-sm p-2 focus:border-infranet focus:ring-1 focus:ring-infranet outline-none text-xs"
                onChange={(e) => { setUser(e.target.value); handleChange(e.target.value, loc, email, func); }} 
              />
            </div>

            {/* Champ Localisation */}
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1.5 text-gray-500 tracking-wider">Localisation</label>
              <input 
                type="text" value={loc} placeholder="Ville, site..." 
                className="w-full border border-gray-300 rounded-sm p-2 focus:border-infranet focus:ring-1 focus:ring-infranet outline-none text-xs"
                onChange={(e) => { setLoc(e.target.value); handleChange(user, e.target.value, email, func); }}
              />
            </div>

            {/* Champ Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1.5 text-gray-500 tracking-wider">Email</label>
              <input 
                type="text" value={email} placeholder="Adresse mail..." 
                className="w-full border border-gray-300 rounded-sm p-2 focus:border-infranet focus:ring-1 focus:ring-infranet outline-none text-xs"
                onChange={(e) => { setEmail(e.target.value); handleChange(user, loc, e.target.value, func); }}
              />
            </div>

            {/* Champ Fonction */}
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1.5 text-gray-500 tracking-wider">Fonction</label>
              <input 
                type="text" value={func} placeholder="Poste, métier..." 
                className="w-full border border-gray-300 rounded-sm p-2 focus:border-infranet focus:ring-1 focus:ring-infranet outline-none text-xs"
                onChange={(e) => { setFunc(e.target.value); handleChange(user, loc, email, e.target.value); }}
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
              <Search size={14} strokeWidth={2.5} /> Recherche
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchBar;