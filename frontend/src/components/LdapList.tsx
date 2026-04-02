import React from 'react';
import { Mail, Phone, MapPin, User, Briefcase, Smartphone, Search } from 'lucide-react';

const LdapList: React.FC = () => {
  // On prépare tes 6 colonnes avec des données de test
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
    <main className="bg-white border-2 border-black shadow-sm overflow-hidden">
      
      {/* Titre de la section */}
      <div className="bg-gray-50 p-4 border-b-2 border-infranet flex justify-between items-center">
        {/* <h2 className="font-black uppercase tracking-tighter text-lg text-gray-700">
          Affichage des données LDAP
        </h2> */}
        <span className="text-[10px] bg-gray-200 px-2 py-1 font-bold rounded">
          {users.length} RÉSULTATS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Entête du tableau avec les 6 colonnes */}
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-3 text-[10px] font-black uppercase text-gray-500 border-r border-gray-200">
                <div className="flex items-center justify-between">Prénoms - Nom <Search size={12} className="text-gray-400" /></div>
              </th>
              <th className="p-3 text-[10px] font-black uppercase text-gray-500 border-r border-gray-200">
                <div className="flex items-center justify-between">Fonction <Search size={12} className="text-gray-400" /></div>
              </th>
              <th className="p-3 text-[10px] font-black uppercase text-gray-500 border-r border-gray-200">
                <div className="flex items-center justify-between">Adresse mail <Search size={12} className="text-gray-400" /></div>
              </th>
              <th className="p-3 text-[10px] font-black uppercase text-gray-500 border-r border-gray-200">
                Tél
              </th>
              <th className="p-3 text-[10px] font-black uppercase text-gray-500 border-r border-gray-200">
                Flotte
              </th>
              <th className="p-3 text-[10px] font-black uppercase text-gray-500">
                <div className="flex items-center justify-between">Localisation <Search size={12} className="text-gray-400" /></div>
              </th>
            </tr>
          </thead>

          {/* Corps du tableau */}
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="p-3 font-bold text-gray-800 border-r border-gray-50 uppercase">
                  {user.prenomNom}
                </td>
                <td className="p-3 text-gray-600 italic border-r border-gray-50">
                  {user.fonction}
                </td>
                <td className="p-3 text-blue-600 border-r border-gray-50">
                  <div className="flex items-center gap-2 underline decoration-gray-200">
                    <Mail size={14} className="text-infranet" /> {user.mail}
                  </div>
                </td>
                <td className="p-3 text-gray-500 border-r border-gray-50">
                  <div className="flex items-center gap-2"><Phone size={14} /> {user.tel}</div>
                </td>
                <td className="p-3 text-gray-500 border-r border-gray-50">
                  <div className="flex items-center gap-2 text-infranet"><Smartphone size={14} /> {user.flotte}</div>
                </td>
                <td className="p-3 text-gray-700 font-medium">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {user.loc}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default LdapList;