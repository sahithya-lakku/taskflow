import { create } from 'zustand';

const initialUser = JSON.parse(localStorage.getItem('taskflow_user') || 'null');
const initialToken = localStorage.getItem('taskflow_token');
const initialTheme = localStorage.getItem('taskflow_theme') || 'light';

export const useAuthStore = create((set) => ({
  user: initialUser,
  token: initialToken,
  theme: initialTheme,
  setAuth: ({ user, token }) => {
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    localStorage.setItem('taskflow_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_refresh_token');
    set({ user: null, token: null });
  },
  setTheme: (theme) => {
    localStorage.setItem('taskflow_theme', theme);
    set({ theme });
  },
}));
