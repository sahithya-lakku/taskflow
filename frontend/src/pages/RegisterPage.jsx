import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <section className="glass-card hidden p-8 md:block">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Get started</p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900">Create your team workspace.</h1>
          <p className="mt-4 text-slate-600">Plan projects, assign tasks, and track status across TODO, IN PROGRESS, and DONE.</p>
        </section>

        <form onSubmit={submit} className="glass-card space-y-4 p-6">
          <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
          <input className="input-base" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-base" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="input-base" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button className="btn-primary w-full">Create account</button>
          <p className="text-sm text-slate-600">
            Already have an account? <Link className="font-semibold text-indigo-200 hover:text-indigo-100" to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
