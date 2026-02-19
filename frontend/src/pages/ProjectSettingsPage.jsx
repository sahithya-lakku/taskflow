import { useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useProjectStore } from '../store/projectStore';

export default function ProjectSettingsPage() {
  const projects = useProjectStore((s) => s.projects);
  const [invite, setInvite] = useState('');

  const projectId = projects[0]?.id;

  const deleteProject = async () => {
    if (!projectId || !window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${projectId}`);
    alert('Project soft deleted');
  };

  const regenerateInvite = async () => {
    if (!projectId) return;
    const { data } = await api.post(`/projects/${projectId}/invites`, { expiresInHours: 24 });
    setInvite(data.data.token);
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <h1 className="section-title">Project settings</h1>
        <div className="glass-card p-4">
          <button className="btn-primary mr-2" onClick={deleteProject}>Delete Project</button>
          <button className="btn-primary" onClick={regenerateInvite}>Regenerate Invite Link</button>
          {invite && <p className="mt-3 text-slate-200">Invite token: <code>{invite}</code></p>}
        </div>
      </main>
    </div>
  );
}
