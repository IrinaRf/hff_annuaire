import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LdapList from './components/LdapList';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [filters, setFilters] = useState({
    user: '', location: '', email: '', functionTitle: ''
  });

  const handleSearchChange = (user: string, location: string, email: string, functionTitle: string) => {
    setFilters({ user, location, email, functionTitle });
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto w-full space-y-6">
        <Header />
        <SearchBar onSearchChange={handleSearchChange} />
        <LdapList filters={filters} />
        <Footer />
      </div>
    </div>
  );
};

export default App;