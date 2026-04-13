import { Home } from 'lucide-react';

const NotFound = () => {
  const homeUrl = import.meta.env.VITE_API_URL_HOME || '/';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-workspace]">
      <div className="bg-white border border-gray-200 shadow-sm p-12 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-gray-100 p-4 rounded-full border border-gray-200">
            <span className="text-5xl font-black text-gray-300">404</span>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">Page introuvable</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Not Found</p>
        </div>
        <p className="text-sm text-gray-600">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <a href={homeUrl} className="inline-flex items-center gap-2 bg-[#1f2937] hover:bg-gray-700 text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors">
          <Home size={14} /> Retour à l'accueil
        </a>
      </div>
    </div>
  );
};
export default NotFound;