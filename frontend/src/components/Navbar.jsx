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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-black text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/40" />
            TaskFlow
          </Link>
          <Link to="/activity" className="text-sm text-slate-200 hover:text-white">Activity</Link>
          <Link to="/reports" className="text-sm text-slate-200 hover:text-white">Reports</Link>
          <Link to="/settings" className="text-sm text-slate-200 hover:text-white">Settings</Link>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white">
            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>

          <button className="relative rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px]">{unreadCount}</span>
            )}
          </button>

          <div className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-200 sm:block">
            Signed in as <span className="font-semibold text-white">{user?.name}</span>
          </div>
          <button onClick={logout} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
