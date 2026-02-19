import { create } from 'zustand';

const initialUser = JSON.parse(localStorage.getItem('taskflow_user') || 'null');
const initialToken = localStorage.getItem('taskflow_token');

export const useAuthStore = create((set) => ({
  user: initialUser,
  token: initialToken,
  setAuth: ({ user, token }) => {
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    localStorage.setItem('taskflow_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
    set({ user: null, token: null });
  },
}));
