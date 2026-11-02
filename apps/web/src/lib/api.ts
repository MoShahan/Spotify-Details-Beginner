import axios, { isAxiosError } from 'axios';

import { clearStoredToken, getStoredToken } from './auth-storage';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthForm =
        url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthForm) {
        clearStoredToken();
      }
    }
    return Promise.reject(error);
  },
);

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (!isAxiosError(error)) {
    return fallback;
  }
  const data: unknown = error.response?.data;
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as ApiErrorBody).error?.message === 'string'
  ) {
    return (data as ApiErrorBody).error.message;
  }
  return fallback;
}
