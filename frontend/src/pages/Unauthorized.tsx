import { LockKeyhole } from 'lucide-react';

const Unauthorized = () => {
  const logoutUrl = import.meta.env.VITE_API_URL_LOGOUT || '/login';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-workspace]">
      <div className="bg-white border border-gray-200 shadow-sm p-12 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-yellow-100 p-4 rounded-full border border-yellow-200">
            <LockKeyhole size={40} className="text-yellow-600" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">Non autorisé</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">401 — Unauthorized</p>
        </div>
        <p className="text-sm text-gray-600">Votre session a expiré ou vous n'êtes pas connecté.</p>
        <a href={logoutUrl} className="inline-flex items-center gap-2 bg-infranet hover:bg-[#e5ac00] text-gray-900 px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors">
          Se reconnecter
        </a>
      </div>
    </div>
  );
};
export default Unauthorized;