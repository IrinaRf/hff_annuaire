import React, { useState, useEffect } from 'react';
import { LogOut, User, ChevronDown, ShieldCheck } from 'lucide-react';
import logoInfranet from '../assets/images/logoHFF.jpg'; 

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState<string>("COLLABORATEUR");

  const checkAuth = () => {
    const savedData = localStorage.getItem('user_data');
    const token = localStorage.getItem('auth_token');

    if (!savedData || !token) {
      if (window.location.pathname !== '/login') {
        window.location.href = import.meta.env.VITE_API_URL_LOGOUT || '/login';
      }
      return;
    }

try {
  const user = JSON.parse(savedData);
   // AU cas où le format serait différent de ce qu'on attend, on veut le voir clairement dans la console pour ajuster le code si besoin
  // console.log("Données utilisateur réelles :", user); 

  setUserName(user.fullname || user.username || "Utilisateur");

  // On vérifie si role vaut 1 pour afficher ADMIN
  // Sinon on met COLLABORATEUR par défaut
  if (user.role === 1) {
    setUserRole("ADMIN");
  } else {
    setUserRole("COLLABORATEUR");
  }

} catch (e) {
      // ✅ Fix : plus de référence circulaire, on fait le nettoyage directement
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = import.meta.env.VITE_API_URL_LOGOUT || '/login';
    }
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data' || e.key === 'auth_token' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    const savedData = localStorage.getItem('user_data');
    let logoutUrl = import.meta.env.VITE_API_URL_LOGOUT || '/login';

    try {
      const user = savedData ? JSON.parse(savedData) : null;
      if (user?.url_logout) logoutUrl = user.url_logout;
    } catch (e) { /* fallback sur logoutUrl par défaut */ }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = logoutUrl;
  };

  return (
    <header className="bg-[#1f2937] shadow-md p-4 flex justify-between items-center border-b-4 border-infranet relative z-50 font-sans">
      <div className="flex items-center">
        <img src={logoInfranet} alt="Logo Infranet" className="h-12 w-auto object-contain" />
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-sm border border-gray-600 transition-all shadow-inner"
        >
          <div className="bg-infranet p-1.5 rounded-full text-gray-900 shadow-sm">
            <User size={16} strokeWidth={3} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">{userName}</span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-2xl rounded-sm py-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ma Session</p>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm
                    ${userRole.toUpperCase() === 'ADMIN' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                    <ShieldCheck size={10} />
                    {userRole}
                  </span>
                </div>
              </div>
              
              <div className="p-1">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-sm transition-colors text-left uppercase tracking-tighter"
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;