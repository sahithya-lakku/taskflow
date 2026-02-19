import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-black text-white">
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/40" />
          TaskFlow
        </Link>

        <div className="flex items-center gap-3">
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
