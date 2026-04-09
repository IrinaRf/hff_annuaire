import { ProtectedLayout } from '@/components/layout';
import { Loader } from '@/components/ui/Loader';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LdapPage = lazy(() => import('@/pages/ldap/LdapPage'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));

const LazyPage = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<Loader label='Chargement ...' />}>{children}</Suspense>
);

export const router = createBrowserRouter([
	{
		//  PUBLIQUE — pas de ProtectedLayout
		path: '/access-denied',
		element: <LazyPage><AccessDenied /></LazyPage>,
	},
	{
		//  PROTÉGÉ — nécessite un token
		element: <ProtectedLayout />,
		children: [
			{
				index: true,
				element: <LazyPage><LdapPage /></LazyPage>,
			}
		]
	}
]);