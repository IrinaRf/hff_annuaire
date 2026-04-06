import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LdapList from './components/LdapList';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [filters, setFilters] = useState({
    user: '', location: '', email: '', functionTitle: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');

    if (token) {
      // 1. Sauvegarde le token
      localStorage.setItem('auth_token', token);
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      // 2. Sinon on reprend celui déjà sauvegardé
      token = localStorage.getItem('auth_token');
    }

    if (token) {
      try {
        // 3. On décode le JWT
        const payload: any = jwtDecode(token);
        console.log('Payload complet :', payload); // 👈 pour voir ce que PHP envoie

        // 4. On sauvegarde les infos utilisateur
        localStorage.setItem('user_data', JSON.stringify({
          fullname: payload.fullname,
          role: payload.roles?.[0] || payload.role,
          email: payload.email,
          url_logout: payload.url_logout,
        }));

      } catch (error) {
        console.error('Token invalide ou expiré', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  const handleSearchChange = (user: string, location: string, email: string, functionTitle: string) => {
    setFilters({ user, location, email, functionTitle });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[--color-workspace]">

  <Header />

  <div className="max-w-screen-2xl mx-auto w-full space-y-6 p-4 md:p-8">
    <SearchBar onSearchChange={handleSearchChange} />
    <LdapList filters={filters} />
    <Footer />
  </div>

</div>
  );
};

export default App;