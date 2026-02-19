import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useProjectStore } from '../store/projectStore';

export default function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const setProjects = useProjectStore((s) => s.setProjects);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createError, setCreateError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const projectCountText = useMemo(() => (projects.length === 1 ? '1 active project' : `${projects.length} active projects`), [projects.length]);

  const fetchProjects = async () => {
    try {
      setError('');
      setLoading(true);
      const { data } = await api.get('/projects');
      const rows = data.data || [];
      setProjects(rows);

      if (rows[0]?.id) {
        const analyticsRes = await api.get(`/projects/${rows[0].id}/analytics`);
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load projects. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setCreateError('Project name is required');
      return;
    }

    try {
      setCreateError('');
      setSubmitting(true);
      await api.post('/projects', {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      });
      setForm({ name: '', description: '' });
      await fetchProjects();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Unable to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const statusData = (analytics?.tasksByStatus || []).map((x) => ({ name: x.status, value: x._count._all }));
  const priorityData = (analytics?.tasksByPriority || []).map((x) => ({ name: x.priority, value: x._count._all }));
  const timeData = (analytics?.timeSpentPerUser || []).map((x) => ({ name: x.userId.slice(0, 6), minutes: x._sum.minutesSpent || 0 }));

  return (
    <div>
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <section className="glass-card bg-gradient-to-r from-indigo-500/25 via-violet-500/15 to-sky-500/20 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Workspace overview</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-200">Build project spaces, collaborate, and track tasks in real time.</p>
          <div className="mt-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-100">{projectCountText}</div>
        </section>

        <section className="glass-card p-5">
          <h2 className="section-title mb-3">Create a project</h2>
          <form onSubmit={createProject} className="grid gap-3 md:grid-cols-3">
            <input className="input-base" placeholder="Project name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <input className="input-base" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Creating...' : 'Create Project'}</button>
          </form>
          {createError && <p className="mt-2 text-sm text-rose-300">{createError}</p>}
        </section>

        {analytics && (
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="glass-card p-4">
              <h3 className="mb-2 text-white">Completion Trend</h3>
              <ResponsiveContainer width="100%" height={220}><LineChart data={statusData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#818cf8" /></LineChart></ResponsiveContainer>
            </div>
            <div className="glass-card p-4">
              <h3 className="mb-2 text-white">Priority Split</h3>
              <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityData} dataKey="value" nameKey="name" outerRadius={80} fill="#22d3ee" /><Tooltip /></PieChart></ResponsiveContainer>
            </div>
            <div className="glass-card p-4">
              <h3 className="mb-2 text-white">Time Spent</h3>
              <ResponsiveContainer width="100%" height={220}><BarChart data={timeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="minutes" fill="#34d399" /></BarChart></ResponsiveContainer>
            </div>
          </section>
        )}

        <section>
          <h2 className="section-title mb-3">Your projects</h2>
          {loading && <p className="text-slate-300">Loading projects...</p>}
          {error && <p className="text-rose-300">{error}</p>}
          {!loading && !error && projects.length === 0 && <div className="glass-card p-4 text-slate-300">No projects yet. Create your first project above.</div>}
          {!loading && !error && projects.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="glass-card group p-4 transition hover:-translate-y-1 hover:border-indigo-300/50">
                  <h3 className="font-semibold text-white group-hover:text-indigo-200">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{project.description || 'No description'}</p>
                  <span className="mt-3 inline-block text-xs text-indigo-200">Open board →</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
