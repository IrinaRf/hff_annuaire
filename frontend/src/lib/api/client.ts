import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  throw new Error('VITE_API_URL is not defined in environment variables');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 — Token invalide ou expiré
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/logout')
      ) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: { Authorization: undefined },
          }
        );

        const { accessToken, user } = response.data;
        localStorage.setItem('accessToken', accessToken);
        if (user) localStorage.setItem('user', JSON.stringify(user));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh échoué → page 401
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/unauthorized'; 
        return Promise.reject(refreshError);
      }
    }

    // 403 — Accès refusé
    if (error.response?.status === 403) {
      window.location.href = '/access-denied'; 
      return Promise.reject(error);
    }

    // 404 - Page non trouvée
    if (error.response?.status === 404) {
    window.location.href = '/not-found';
    return Promise.reject(error);
}

    // 500 — Erreur serveur
    if (error.response?.status === 500) {
      window.location.href = '/server-error'; 
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);