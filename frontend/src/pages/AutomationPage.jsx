import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useProjectStore } from '../store/projectStore';

export default function AutomationPage() {
  const projects = useProjectStore((s) => s.projects);
  const projectId = projects[0]?.id;
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    triggerType: 'DATE_REACHED',
    conditionField: 'status',
    conditionValue: 'DONE',
    actionType: 'NOTIFY',
  });

  const load = async () => {
    if (!projectId) return;
    const { data } = await api.get(`/automation/${projectId}`);
    setRules(data.data || []);
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const createRule = async () => {
    if (!projectId) return;
    await api.post(`/automation/${projectId}`, { projectId, ...form });
    await load();
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6 pb-20">
        <h1 className="section-title mb-3">Automation rules</h1>

        <div className="glass-card space-y-2">
          <select className="input-base" value={form.triggerType} onChange={(e) => setForm({ ...form, triggerType: e.target.value })}>
            <option>DATE_REACHED</option>
            <option>STATUS_CHANGED</option>
          </select>

          <input className="input-base" placeholder="conditionField" value={form.conditionField} onChange={(e) => setForm({ ...form, conditionField: e.target.value })} />
          <input className="input-base" placeholder="conditionValue" value={form.conditionValue} onChange={(e) => setForm({ ...form, conditionValue: e.target.value })} />

          <select className="input-base" value={form.actionType} onChange={(e) => setForm({ ...form, actionType: e.target.value })}>
            <option>NOTIFY</option>
            <option>CHANGE_STATUS</option>
          </select>

          <button className="btn-primary" onClick={createRule}>Create rule</button>
        </div>

        <div className="mt-4 space-y-2">
          {rules.map((r) => (
            <div key={r.id} className="glass-card text-sm">
              {r.triggerType} | {r.conditionField}={r.conditionValue} {'=>'} {r.actionType}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
