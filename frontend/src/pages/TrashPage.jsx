import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function TrashPage() {
  const [trash, setTrash] = useState({ projects: [], tasks: [] });
  const load = () => api.get('/trash').then(({ data }) => setTrash(data.data));
  useEffect(() => { load(); }, []);

  const restore = async (type, id) => { await api.post('/trash/restore', { type, id }); load(); };
  const forceDelete = async (type, id) => { await api.delete('/trash/force-delete', { data: { type, id } }); load(); };

  return <div><Navbar /><main className="mx-auto max-w-5xl px-4 py-6 space-y-3"><h1 className="section-title">Trash</h1>{trash.projects.map((p)=><div key={p.id} className="glass-card flex justify-between"><span>{p.name}</span><div className="space-x-2"><button className="btn-primary" onClick={()=>restore('project',p.id)}>Restore</button><button className="btn-primary" onClick={()=>forceDelete('project',p.id)}>Force Delete</button></div></div>)}{trash.tasks.map((t)=><div key={t.id} className="glass-card flex justify-between"><span>{t.title}</span><div className="space-x-2"><button className="btn-primary" onClick={()=>restore('task',t.id)}>Restore</button><button className="btn-primary" onClick={()=>forceDelete('task',t.id)}>Force Delete</button></div></div>)}</main></div>;
}
