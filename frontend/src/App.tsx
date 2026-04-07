import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import SearchBar from './components/SearchBar';
import LdapList from './components/LdapList';
import Footer from './components/Footer';

// ✅ HORS DU COMPOSANT — s'exécute avant tout rendu
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get('token');

if (tokenFromUrl) {
  localStorage.setItem('auth_token', tokenFromUrl);
  try {
    const payload: any = jwtDecode(tokenFromUrl);
    localStorage.setItem('user_data', JSON.stringify({
      fullname: payload.fullname,
      roles: payload.roles,
      email: payload.email,
      url_logout: payload.url_logout,
    }));
  } catch(e) {
    console.error('Token invalide', e);
  }
  window.history.replaceState({}, '', window.location.pathname);
}
// ✅ Fin du bloc hors composant

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
      <Breadcrumb />
      <div className="max-w-screen-2xl mx-auto w-full space-y-6 p-4 md:p-8">
        <SearchBar onSearchChange={handleSearchChange} />
        <LdapList filters={filters} />
        <Footer />
      </div>
    </div>
  );
};

export default App;