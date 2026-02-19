import { useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useProjectStore } from '../store/projectStore';

export default function ProjectSettingsPage() {
  const projects = useProjectStore((s) => s.projects);
  const [invite, setInvite] = useState('');
  const [realtimePref, setRealtimePref] = useState(true);

  const projectId = projects[0]?.id;

  const deleteProject = async () => {
    if (!projectId || !window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${projectId}`);
    alert('Project moved to trash');
  };

  const regenerateInvite = async () => {
    if (!projectId) return;
    const { data } = await api.post(`/projects/${projectId}/invites`, { expiresInHours: 24 });
    setInvite(data.data.token);
  };

  const savePref = async () => {
    await api.put('/profile/notification-preferences', { receiveRealtimeNotifications: realtimePref });
    alert('Preference updated');
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto lg:ml-64 max-w-4xl px-4 py-6 space-y-4 pb-20">
        <h1 className="section-title">Project settings</h1>
        <div className="glass-card">
          <button className="btn-primary mr-2" onClick={deleteProject}>Delete Project</button>
          <button className="btn-primary" onClick={regenerateInvite}>Regenerate Invite Link</button>
          {invite && <p className="mt-3">Invite token: <code>{invite}</code></p>}
        </div>

        <div className="glass-card">
          <h2 className="font-semibold mb-2">Notification preferences</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={realtimePref} onChange={(e) => setRealtimePref(e.target.checked)} />
            Receive realtime notifications
          </label>
          <button className="btn-primary mt-3" onClick={savePref}>Save preference</button>
        </div>
      </main>
    </div>
  );
}
