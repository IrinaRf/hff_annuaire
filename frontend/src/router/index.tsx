import { ProtectedLayout } from '@/components/layout';
import { Loader } from '@/components/ui/Loader';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LdapPage = lazy(() => import('@/pages/ldap/LdapPage'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));
const ServerError = lazy(() => import('@/pages/ServerError'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));

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
		path: '/server-error',
		element: <LazyPage><ServerError /></LazyPage>,
	},
	{
		path: '/not-found',
		element: <LazyPage><NotFound /></LazyPage>,
	},
	{
    path: '*',  
    element: <LazyPage><NotFound /></LazyPage>,
},
	{
		path:'/unauthorized',
		element: <LazyPage><Unauthorized /></LazyPage>,
	},
	{
		//  PROTÉGÉ — nécessite un token
		element: <ProtectedLayout />,
		children: [
			{
				path: 'hffintranet/annuaire',
				element: <LazyPage><LdapPage /></LazyPage>,
			}
		]
	}
]);