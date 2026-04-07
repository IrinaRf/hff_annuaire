import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import SearchBar from './components/SearchBar';
import LdapList from './components/LdapList';
import Footer from './components/Footer';

// Traitement du token AVANT tout rendu
function initSession(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');

  if (tokenFromUrl) {
    try {
      const payload: any = jwtDecode(tokenFromUrl);
      console.log("Token décodé :", payload); // À garder pour tes tests IT

      // Détection du rôle ultra-souple
      const roleValue = payload.role !== undefined
        ? Number(payload.role)
        : (payload.roles?.includes('ADMIN') || payload.roles?.includes('ROLE_ADMIN') ? 1 : 0);

      // On écrit les deux clés AVANT de nettoyer l'URL
      localStorage.setItem('auth_token', tokenFromUrl);
      localStorage.setItem('user_data', JSON.stringify({
        // ✅ On ajoute des fallbacks pour le nom (très important pour le Header)
        fullname: payload.fullname || payload.name || payload.displayname || "Utilisateur",
        email: payload.email || payload.mail || "",
        url_logout: payload.url_logout || null,
        role: roleValue,
      }));

      // ✅ TRÈS IMPORTANT : On prévient les autres composants (Header) que le storage a changé
      window.dispatchEvent(new Event('storage'));

    } catch (e) {
      console.error('Erreur JWT:', e);
    }
    // On nettoie l'URL seulement après avoir tout sauvegardé
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// Appel synchrone immédiat
initSession();

const App: React.FC = () => {
  const [filters, setFilters] = useState({
    user: '', location: '', email: '', functionTitle: ''
  });

  const handleSearchChange = (user: string, location: string, email: string, functionTitle: string) => {
    setFilters({ user, location, email, functionTitle });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[--color-workspace]">
      <Header />
      <div className="max-w-screen-2xl mx-auto w-full space-y-6 p-4 md:p-8 flex-grow">
        <Breadcrumb />
        <SearchBar onSearchChange={handleSearchChange} />
        <LdapList filters={filters} />
      </div>
      <Footer />
    </div>
  );
};

export default App;