import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Breadcrumb from '../ui/Breadcrumb';
import { Loader } from '../ui/Loader';
import ScrollToTop from '../ui/ScrollToTop';
import Footer from './Footer';
import Header from './Header';

export const ProtectedLayout = () => {
	const { isAuthenticated, isLoading, revalidateAuth } = useAuth();

	useEffect(() => {
		if (isLoading || isAuthenticated) return;
		revalidateAuth();
	}, [isAuthenticated, isLoading]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<Loader
						size={50}
						label="Vérification de l'authentification..."
						/>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col min-h-screen">
				<Header />
				<div className="max-w-screen-2xl mx-auto w-full space-y-6 p-4 md:p-8 grow flex-1">
					<Breadcrumb />
					<Outlet />
				</div>
				<Footer />

				<ScrollToTop />
			</div>
		</>
	);
};
