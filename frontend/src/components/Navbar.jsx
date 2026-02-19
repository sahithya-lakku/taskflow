import { Bell, LayoutDashboard, Moon, Settings, Sun, User, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAuthStore((s) => s.theme);
  const setTheme = useAuthStore((s) => s.setTheme);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    if (theme === 'auto') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark', dark);
    }
  }, [theme]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/notifications?limit=5');
        setNotifications(data.data || []);
      } catch (_e) {}
    };
    load();
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-lg font-black text-indigo-600">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-400" /> TaskFlow
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/dashboard" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><LayoutDashboard size={18} /></Link>
            <Link to="/activity" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Activity size={18} /></Link>
            <Link to="/reports" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><FileText size={18} /></Link>
            <Link to="/profile" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><User size={18} /></Link>
            <Link to="/settings" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Settings size={18} /></Link>
          </div>

          <div className="flex items-center gap-2">
            <select className="rounded-lg border px-2 py-1 text-xs dark:bg-slate-800" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
            <button className="rounded-lg border p-2 text-xs" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>

            <button className="relative rounded-lg border p-2">
              <Bell size={16} />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-[10px] text-white">{unreadCount}</span>}
            </button>

            <motion.button whileTap={{ scale: 0.96 }} onClick={logout} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white">Logout</motion.button>
          </div>
        </nav>
      </header>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white p-2 md:hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <Link to="/dashboard"><LayoutDashboard size={18} /></Link>
          <Link to="/activity"><Activity size={18} /></Link>
          <Link to="/reports"><FileText size={18} /></Link>
          <Link to="/profile"><User size={18} /></Link>
          <Link to="/settings"><Settings size={18} /></Link>
        </div>
      </div>
    </>
  );
}
