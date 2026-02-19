import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => setAnalytics(data.data)).catch(() => {});
    api.get('/admin/audit-logs').then(({ data }) => setLogs(data.data || [])).catch(() => {});
  }, []);

  const exportCsv = () => {
    const rows = ['action,userId,createdAt', ...logs.map((l) => `${l.action},${l.userId || ''},${l.createdAt}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audit-logs.csv'; a.click();
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <h1 className="section-title">Admin dashboard</h1>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="glass-card">Users: {analytics?.users ?? '-'}</div>
          <div className="glass-card">Projects: {analytics?.projects ?? '-'}</div>
          <div className="glass-card">Tasks: {analytics?.tasks ?? '-'}</div>
          <div className="glass-card">Completed: {analytics?.completedTasks ?? '-'}</div>
        </div>
        <div className="glass-card">
          <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Audit logs</h2><button className="btn-primary" onClick={exportCsv}>Export CSV</button></div>
          <div className="space-y-2">
            {logs.map((log) => <div key={log.id} className="rounded border p-2 text-sm">{log.action} • {new Date(log.createdAt).toLocaleString()}</div>)}
          </div>
        </div>
      </main>
    </div>
  );
}
