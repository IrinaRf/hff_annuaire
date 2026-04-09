import { ShieldX } from 'lucide-react';
import React from 'react';

const AccessDenied: React.FC = () => {
  const logoutUrl = import.meta.env.VITE_API_URL_LOGOUT || '/login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-workspace]">
      <div className="bg-white border border-gray-200 shadow-sm p-12 max-w-md w-full text-center space-y-6">
        
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full border border-red-200">
            <ShieldX size={40} className="text-red-600" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">
            Accès Refusé
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            403 — Forbidden
          </p>
        </div>

        <p className="text-sm text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <a
          href={logoutUrl}
          className="inline-flex items-center gap-2 bg-[#1f2937] hover:bg-gray-700 text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Retourner à l'accueil
        </a>

      </div>
    </div>
  );
};

export default AccessDenied;