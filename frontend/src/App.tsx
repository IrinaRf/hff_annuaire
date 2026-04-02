import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LdapList from './components/LdapList';
import Footer from './components/Footer';

const App: React.FC = () => {
  const handleSearchChange = (user: string, location: string) => {
    // Handle search changes here
    console.log('User:', user, 'Location:', location);
  };

  return (

    <div className="min-h-screen flex flex-col p-4 md:p-8">
      
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* 1. Le Haut de page */}
        <Header />

        {/* 2. La barre de recherche */}
        <SearchBar onSearchChange={handleSearchChange} />

        {/* 3. Le coeur de l'application (LDAP) */}
        <LdapList />

        {/* 4. Le Pied de page */}
        <Footer />

      </div>
    </div>
  );
};

export default App;