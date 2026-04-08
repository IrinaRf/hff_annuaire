import type { User } from '@/types/user.type';
import { apiClient } from './client';

/**
 * Auth API Service
 * Handles all authentication-related API calls
 */
export const authApi = {

	/**
	 * Logout current user
	 */
	async logout(): Promise<void> {
		localStorage.removeItem('user');
		localStorage.removeItem('accessToken');
    	window.location.href = import.meta.env.VITE_API_URL_LOGOUT || '/logout';
	},

	async checkSession() {
		try {
			const response = await apiClient.get<{
				user: User | null;
				message: string;
        error: string | null;
			}>('/api/session', {
        baseURL: import.meta.env.VITE_API_URL_HOME || '/',
      });
			return response.data;
		} catch (error) {
			console.error('Session check failed:', error);
			return { user: null, message: 'Failed to check session', error: 'Failed to check session' };
		}
	},
};
