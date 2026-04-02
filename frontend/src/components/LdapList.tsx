import React from 'react';
import { Mail, Phone, MapPin, Smartphone, Search, FileSpreadsheet } from 'lucide-react';

const LdapList: React.FC = () => {
  const users = [
    { 
      id: 1, 
      prenomNom: "John DOE", 
      fonction: "Admin Réseau", 
      mail: "j.doet@infranet.fr", 
      tel: "+261 00 00 000 00", 
      flotte: "123", 
      loc: "HFF Antananarivo" 
    },
    { 
      id: 2, 
      prenomNom: "Jane SMITH", 
      fonction: "DSI", 
      mail: "j.smith@infranet.fr", 
      tel: "+261 00 00 000 01", 
      flotte: "456", 
      loc: "HFF Tamatave" 
    }
  ];

  return (
    <main className="bg-white border border-gray-200 shadow-sm overflow-hidden">
      
      {/* 1. BARRE D'OUTILS (Action Excel + Compteur) */}
      <div className="p-3 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Résultats
          </span>
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-black">
            {users.length}
          </span>
        </div>

        {/* Bouton Excel style Option A */}
        <button className="flex items-center gap-2 bg-[#1D6F42] hover:bg-[#155231] text-white px-3 py-1.5 rounded-sm font-bold text-[11px] transition-colors shadow-sm">
          <FileSpreadsheet size={14} />
          <span>EXPORTER EXCEL</span>
        </button>
      </div>

      {/* 2. TABLEAU AVEC EN-TÊTE NOIR (Standardisation) */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            {/* On passe sur un fond sombre comme sur ta capture */}
            <tr className="bg-[#1f2937] text-white">
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">
                <div className="flex items-center justify-between gap-2">
                  Prénoms - Nom <Search size={12} className="text-gray-500" />
                </div>
              </th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">
                <div className="flex items-center justify-between gap-2">
                  Fonction <Search size={12} className="text-gray-500" />
                </div>
              </th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">
                <div className="flex items-center justify-between gap-2">
                  Email <Search size={12} className="text-gray-500" />
                </div>
              </th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">
                Tél
              </th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">
                Flotte
              </th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center justify-between gap-2">
                  Localisation <Search size={12} className="text-gray-500" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/80 transition-colors text-sm">
                <td className="p-3 font-bold text-gray-700 uppercase">
                  {user.prenomNom}
                </td>
                <td className="p-3 text-gray-500 italic text-xs">
                  {user.fonction}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                    <Mail size={14} className="text-infranet" /> 
                    <span className="text-xs">{user.mail}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  <div className="flex items-center gap-2 text-[11px]">
                    <Phone size={13} className="text-gray-400" /> {user.tel}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 text-infranet font-bold text-[11px]">
                    <Smartphone size={13} /> {user.flotte}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-100 text-[11px] text-gray-600 w-fit">
                    <MapPin size={12} className="text-gray-400" /> {user.loc}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message "Aucune donnée trouvée" (si users est vide) */}
      {users.length === 0 && (
        <div className="p-12 text-center text-gray-400 italic text-sm">
          Aucune donnée trouvée
        </div>
      )}
    </main>
  );
};

export default LdapList;