import { Activity, Bell, Bookmark, Calendar, FileText, LayoutDashboard, Moon, Settings, Shield, Sun, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: Activity, label: 'Projects' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/reports', icon: FileText, label: 'Analytics' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAuthStore((s) => s.theme);
  const setTheme = useAuthStore((s) => s.setTheme);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  const items = useMemo(() => (user?.role === 'SUPER_ADMIN' ? [...navItems, { to: '/admin', icon: Shield, label: 'Admin' }] : navItems), [user?.role]);

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
      <aside className="fixed left-0 top-0 hidden h-full w-60 border-r border-slate-200 bg-white p-4 shadow-sm lg:block dark:border-slate-700 dark:bg-slate-900">
        <Link to="/dashboard" className="mb-4 flex items-center gap-2 text-lg font-black text-indigo-600"><span className="h-3 w-3 rounded-full bg-emerald-400" /> TaskFlow</Link>
        <div className="space-y-1">
          {items.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
            return (
              <Link key={to} to={to} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${active ? 'bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 lg:ml-60">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="font-semibold">Welcome</span>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{user?.name}</span>
            {user?.role === 'SUPER_ADMIN' && <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700">ADMIN</span>}
          </div>

          <div className="flex items-center gap-2">
            <select className="rounded-lg border px-2 py-1 text-xs dark:bg-slate-800" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option><option value="dark">Dark</option><option value="auto">Auto</option>
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

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white p-2 lg:hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {items.slice(0, 5).map(({ to, icon: Icon }) => <Link key={to} to={to}><Icon size={18} /></Link>)}
        </div>
      </div>
    </>
  );
}
