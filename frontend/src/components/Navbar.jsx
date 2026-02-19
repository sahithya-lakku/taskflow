import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="font-bold text-xl text-indigo-600">TaskFlow</Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">{user?.name}</span>
        <button onClick={logout} className="bg-slate-900 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
}
