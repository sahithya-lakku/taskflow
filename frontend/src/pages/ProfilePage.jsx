import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: '', phone: '', location: '', title: '', skills: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/profile');
    setProfile(data.data);
    const p = data.data.profile || {};
    setForm({ bio: p.bio || '', phone: p.phone || '', location: p.location || '', title: p.title || '', skills: (p.skills || []).join(', ') });
    setAvatarPreview(p.avatarUrl || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (form.bio.length > 600) return showToast('Bio too long');
    await api.put('/profile', { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) });
    showToast('Profile saved');
    await load();
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return showToast('Choose an image');
    const fd = new FormData();
    fd.append('avatar', avatarFile);
    await api.put('/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    showToast('Avatar updated');
    await load();
  };

  const updatePassword = async () => {
    if (passwordForm.newPassword.length < 8) return showToast('Password must be at least 8 chars');
    await api.put('/profile/password', passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '' });
    showToast('Password updated');
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure? This will suspend your account.')) return;
    await api.delete('/profile/account');
    showToast('Account deleted');
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto lg:ml-64 max-w-5xl px-4 py-6 grid gap-4 lg:grid-cols-3 pb-20">
        <section className="glass-card lg:col-span-2">
          <h1 className="section-title mb-3">Profile</h1>
          {loading ? <div className="animate-pulse h-24 rounded bg-slate-200" /> : (
            <div className="grid gap-3">
              <textarea className="input-base" placeholder="Bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
              <input className="input-base" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <input className="input-base" placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              <input className="input-base" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              <input className="input-base" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
              <button className="btn-primary" onClick={save}>Save profile</button>
            </div>
          )}
        </section>

        <section className="glass-card space-y-3">
          <h2 className="font-semibold">Avatar & Stats</h2>
          {avatarPreview ? <img src={avatarPreview} alt="avatar" className="h-24 w-24 rounded-full object-cover border" /> : <div className="h-24 w-24 rounded-full bg-slate-200" />}
          <input type="file" accept="image/png,image/jpeg" onChange={(e) => { const f = e.target.files?.[0]; setAvatarFile(f || null); if (f) setAvatarPreview(URL.createObjectURL(f)); }} />
          <button className="btn-primary" onClick={uploadAvatar}>Upload avatar</button>

          <div className="rounded border p-2 text-sm">
            <p>Tasks completed: {profile?.stats?.tasksCompleted || 0}</p>
            <p>Hours logged: {profile?.stats?.hoursLogged || 0}</p>
            <p>Streak: {profile?.stats?.streak || 0}</p>
            <p>Level: {profile?.stats?.level || 1}</p>
          </div>

          <div className="space-y-2">
            <input type="password" className="input-base" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((v) => ({ ...v, currentPassword: e.target.value }))} />
            <input type="password" className="input-base" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((v) => ({ ...v, newPassword: e.target.value }))} />
            <button className="btn-primary" onClick={updatePassword}>Update password</button>
          </div>

          <button className="rounded-xl bg-red-500 px-3 py-2 text-white" onClick={deleteAccount}>Delete account</button>
        </section>
        {toast && <div className="fixed right-4 top-20 rounded bg-slate-900 px-3 py-2 text-sm text-white">{toast}</div>}
      </main>
    </div>
  );
}
