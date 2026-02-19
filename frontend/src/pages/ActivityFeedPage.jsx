import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useProjectStore } from '../store/projectStore';

export default function ActivityFeedPage() {
  const projects = useProjectStore((s) => s.projects);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!projects[0]?.id) return;
      const { data } = await api.get(`/projects/${projects[0].id}/activity`);
      setActivity(data.data || []);
    };
    load();
  }, [projects]);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="section-title mb-4">Activity timeline</h1>
        <div className="space-y-3">
          {activity.map((a) => (
            <div key={a.id} className="glass-card p-3">
              <p className="text-white">{a.action}</p>
              <p className="text-xs text-slate-300">By {a.performedBy} • {new Date(a.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
