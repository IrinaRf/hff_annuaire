// import { authApi } from '@/lib/api/auth.api';
import { authApi } from '@/lib/api/auth.api';
import { UserRole, type User } from '@/types';
import { jwtDecode } from 'jwt-decode';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;

	logout: () => void;

	removeAuth: () => void;
	revalidateAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = {
	user: 'user',
	accessToken: 'accessToken',
}

const LoadSession = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const tokenFromUrl = urlParams.get('token');

	if (tokenFromUrl) {
		try {
			const payload: User = jwtDecode(tokenFromUrl);
			console.log('Token décodé :', payload); // À garder pour tes tests IT

			// Détection du rôle ultra-souple
			const roleValue =
				payload.role !== undefined
					? Number(payload.role)
					: payload.roles?.includes(1) ||
						  payload.roles?.includes(7)
						? UserRole.ADMIN
						: UserRole.USER;

			// On écrit les deux clés AVANT de nettoyer l'URL
			localStorage.setItem(AUTH_STORAGE_KEY.accessToken, tokenFromUrl);
			localStorage.setItem(
				AUTH_STORAGE_KEY.user,
				JSON.stringify({
					// ✅ On ajoute des fallbacks pour le nom (très important pour le Header)
					fullname:
						payload.fullname ||
						payload.name ||
						payload.displayname ||
						'Utilisateur',
					email: payload.email || payload.mail || '',
					url_logout: payload.url_logout || null,
					role: roleValue,
				}),
			);

			// ✅ TRÈS IMPORTANT : On prévient les autres composants (Header) que le storage a changé
			window.dispatchEvent(new Event('storage'));
		} catch (e) {
			console.error('Erreur JWT:', e);
		}
		// On nettoie l'URL seulement après avoir tout sauvegardé
		window.history.replaceState({}, '', window.location.pathname);
	}
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	//? Initialisation de la session à partir du token dans l'URL (si présent)
	useEffect(() => {
		const initAuth = async () => {
			LoadSession(); //! Il faut supprimer cette ligne et faire un vrai appel à l'API de refresh du token quand on aura un backend qui le supporte
			const storedUser = localStorage.getItem(AUTH_STORAGE_KEY.user);
			const accessToken = localStorage.getItem(AUTH_STORAGE_KEY.accessToken);

			if (storedUser && accessToken) {
				try {
					setUser(JSON.parse(storedUser));
				} catch (error) {
					console.error('Failed to parse stored user:', error);
					localStorage.removeItem(AUTH_STORAGE_KEY.user);
					localStorage.removeItem(AUTH_STORAGE_KEY.accessToken);
				}
			}

			setIsLoading(false);
		};

		initAuth();
	}, []);

	const removeAuth = () => {
		setUser(null);
		localStorage.removeItem(AUTH_STORAGE_KEY.user);
		localStorage.removeItem(AUTH_STORAGE_KEY.accessToken);
	};
	
	const logout = async () => {
		await authApi.logout();
	}


	const revalidateAuth = async () => {
		const res = await authApi.checkSession();
		if (!res.user || res.error) {
			console.log(res);
			return;
		}
	}

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated: !!user && !!localStorage.getItem(AUTH_STORAGE_KEY.accessToken),
		logout,
		removeAuth,
		revalidateAuth
	};


	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
