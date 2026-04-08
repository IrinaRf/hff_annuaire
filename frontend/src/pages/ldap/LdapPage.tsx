import LdapList from '@/components/pages/Ldap/LdapList';
import SearchBar from '@/components/ui/SearchBar';
import { useState } from 'react';

export default function LdapPage() {
	const [filters, setFilters] = useState({
			user: '',
			location: '',
			email: '',
			functionTitle: '',
		});
	
		const handleSearchChange = (
			user: string,
			location: string,
			email: string,
			functionTitle: string,
		) => {
			setFilters({ user, location, email, functionTitle });
		};
	return <>
		<SearchBar onSearchChange={handleSearchChange} />
		<LdapList filters={filters} />
	</>
}
