import { ProtectedLayout } from '@/components/layout';
import { Loader } from '@/components/ui/Loader';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LdapPage = lazy(() => import('@/pages/ldap/LdapPage'));
<<<<<<< Updated upstream
=======
const AccessDenied = lazy(() => import ('@/pages/AccessDenied'));
>>>>>>> Stashed changes

const LazyPage = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<Loader label='Chargement ...' />}>{children}</Suspense>
);

export const router = createBrowserRouter([
	{
<<<<<<< Updated upstream
=======
		
		path: '/access-denied',
		element: <LazyPage><AccessDenied /></LazyPage>,
	},
	{
		
>>>>>>> Stashed changes
		element: <ProtectedLayout />,
		children: [
			{
				index: true,
				element: <LazyPage><LdapPage /></LazyPage>,
			}
		]
	}
<<<<<<< Updated upstream
]);
=======
]);
>>>>>>> Stashed changes
