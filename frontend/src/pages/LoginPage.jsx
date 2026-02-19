import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const { data } = await api.post('/auth/login', form);
      setAuth({ user: data.user, token: data.token });
      if (data.refreshToken) localStorage.setItem('taskflow_refresh_token', data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <section className="glass-card hidden p-8 md:block">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">TaskFlow</p>
          <h1 className="mt-3 text-4xl font-extrabold text-white">Move work forward beautifully.</h1>
          <p className="mt-4 text-slate-300">Real-time tasks, collaborative projects, and a fast dashboard designed for teams.</p>
        </section>

        <form onSubmit={submit} className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <input className="input-base" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="input-base" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button className="btn-primary w-full">Sign In</button>
          <p className="text-sm text-slate-300">
            No account? <Link className="font-semibold text-indigo-200 hover:text-indigo-100" to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
