import { router } from '@/router';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
};

export default App;
