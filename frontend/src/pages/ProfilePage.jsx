import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: '', phone: '', location: '', title: '', skills: '' });

  const load = async () => {
    const { data } = await api.get('/profile');
    setProfile(data.data);
    const p = data.data.profile || {};
    setForm({ bio: p.bio || '', phone: p.phone || '', location: p.location || '', title: p.title || '', skills: (p.skills || []).join(', ') });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.put('/profile', { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) });
    await load();
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6 grid gap-4 lg:grid-cols-3">
        <section className="glass-card lg:col-span-2">
          <h1 className="section-title mb-3">Profile</h1>
          <div className="grid gap-3">
            <textarea className="input-base" placeholder="Bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
            <input className="input-base" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <input className="input-base" placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <input className="input-base" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <input className="input-base" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
            <button className="btn-primary" onClick={save}>Save profile</button>
          </div>
        </section>

        <section className="glass-card">
          <h2 className="font-semibold mb-2">Stats</h2>
          <p>Tasks completed: {profile?.stats?.tasksCompleted || 0}</p>
          <p>Hours logged: {profile?.stats?.hoursLogged || 0}</p>
          <p>Streak: {profile?.stats?.streak || 0}</p>
          <p>Level: {profile?.stats?.level || 1}</p>
        </section>
      </main>
    </div>
  );
}
