import { ProtectedLayout } from '@/components/layout';
import { Loader } from '@/components/ui/Loader';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LdapPage = lazy(() => import('@/pages/ldap/LdapPage'));

const LazyPage = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<Loader label='Chargement ...' />}>{children}</Suspense>
);

export const router = createBrowserRouter([
	{
		element: <ProtectedLayout />,
		children: [
			{
				index: true,
				element: <LazyPage><LdapPage /></LazyPage>,
			}
		]
	}
]);
