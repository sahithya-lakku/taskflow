import { Shield } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const load = async () => {
    const [a, l, u] = await Promise.all([
      api.get('/admin/analytics').then((r) => r.data.data),
      api.get('/admin/audit-logs').then((r) => r.data.data || []),
      api.get(`/admin/users?page=${page}&limit=10&email=${encodeURIComponent(email)}&role=${role}`).then((r) => r.data.data || []),
    ]);
    setAnalytics(a);
    setLogs(l);
    setUsers(u);
  };

  useEffect(() => { load().catch(() => {}); }, [page, role]);

  const exportCsv = () => {
    const rows = ['action,userId,createdAt', ...logs.map((l) => `${l.action},${l.userId || ''},${l.createdAt}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audit-logs.csv'; a.click();
  };

  const exportUsersCsv = () => {
    const rows = ['name,email,role,suspended,taskCount,createdAt', ...users.map((u) => `${u.name},${u.email},${u.role},${u.suspended},${u.taskCount},${u.createdAt}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'users.csv'; a.click();
  };

  const suspendUser = async (id) => { await api.patch(`/admin/users/${id}/suspend`); await load(); };
  const deleteUser = async (id) => { if (!window.confirm('Delete user?')) return; await api.delete(`/admin/users/${id}`); await load(); };
  const resetPassword = async (id) => { await api.patch(`/admin/users/${id}/reset-password`, { newPassword: 'Temp@12345' }); alert('Password reset to Temp@12345'); };
  const updateRole = async (id, newRole) => { await api.patch(`/admin/users/${id}/role`, { role: newRole }); await load(); };

  const badge = useMemo(() => (user?.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : null), [user]);

  if (user?.role !== 'SUPER_ADMIN') return <Navigate to="/dashboard" replace />;

  return (
    <div>
      <Navbar />
      <main className="mx-auto lg:ml-64 max-w-6xl px-4 py-6 space-y-4 pb-20">
        <div className="flex items-center gap-2"><Shield className="text-indigo-600" /><h1 className="section-title">Admin dashboard</h1>{badge && <span className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-700">{badge}</span>}</div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="glass-card">Total users: {analytics?.users ?? '-'}</div>
          <div className="glass-card">Active users: {analytics?.activeUsers ?? '-'}</div>
          <div className="glass-card">Total projects: {analytics?.projects ?? '-'}</div>
          <div className="glass-card">Total tasks: {analytics?.tasks ?? '-'}</div>
        </div>

        <div className="glass-card space-y-3">
          <div className="flex flex-wrap gap-2">
            <input className="input-base max-w-sm" placeholder="Search by email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="input-base max-w-xs" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
            <button className="btn-primary" onClick={load}>Search</button>
            <button className="btn-primary" onClick={exportUsersCsv}>Export users CSV</button>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left text-slate-600"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Tasks</th><th className="p-2">Last login</th><th className="p-2">Created</th><th className="p-2">Actions</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)} className="rounded border px-2 py-1">
                        <option>USER</option><option>ADMIN</option><option>SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="p-2">{u.taskCount}</td>
                    <td className="p-2">{u.lastLogin || '-'}</td>
                    <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 space-x-1">
                      <button className="rounded bg-yellow-100 px-2 py-1" onClick={() => suspendUser(u.id)}>Suspend</button>
                      <button className="rounded bg-indigo-100 px-2 py-1" onClick={() => resetPassword(u.id)}>Reset</button>
                      <button className="rounded bg-red-100 px-2 py-1" onClick={() => deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2"><button className="btn-primary" onClick={() => setPage((p) => Math.max(1,p-1))}>Prev</button><button className="btn-primary" onClick={() => setPage((p) => p+1)}>Next</button></div>
        </div>

        <div className="glass-card">
          <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Audit logs</h2><button className="btn-primary" onClick={exportCsv}>Export CSV</button></div>
          <div className="space-y-2 max-h-72 overflow-auto">
            {logs.map((log) => <div key={log.id} className="rounded border p-2 text-sm">{log.action} • {new Date(log.createdAt).toLocaleString()}</div>)}
          </div>
        </div>
      </main>
    </div>
  );
}
