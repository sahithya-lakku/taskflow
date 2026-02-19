import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { getSocket } from '../socket/client';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const token = useAuthStore((s) => s.token);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError('');
        const { data } = await api.get(`/tasks/project/${projectId}`);
        const list = data.data || [];
        setTasks(list);
        if (list[0]?.id) setSelectedTaskId(list[0].id);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch tasks for this project');
      }
    };

    fetchTasks();
    const socket = getSocket(token);
    socket.emit('project:join', projectId);

    socket.on('task:created', (task) => setTasks((prev) => [task, ...prev]));
    socket.on('task:updated', (task) => setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t))));
    socket.on('task:deleted', ({ id }) => setTasks((prev) => prev.filter((t) => t.id !== id)));
    socket.on('comment:created', (comment) => setComments((prev) => [...prev, comment]));

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.off('comment:created');
    };
  }, [projectId, token]);

  useEffect(() => {
    if (!selectedTaskId) return;
    api.get(`/tasks/${selectedTaskId}/comments`).then(({ data }) => setComments(data.data || [])).catch(() => {});
  }, [selectedTaskId]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post(`/tasks/project/${projectId}`, { title: title.trim() });
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task');
    }
  };

  const onStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task status');
    }
  };

  const sendComment = async () => {
    if (!selectedTaskId || !commentText.trim()) return;
    await api.post(`/tasks/${selectedTaskId}/comments`, { content: commentText.trim() });
    setCommentText('');
  };

  const totalTasks = useMemo(() => tasks.length, [tasks.length]);

  return (
    <div>
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6">
        <section className="glass-card bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/20 to-sky-500/20 p-6">
          <h1 className="text-3xl font-bold text-white">Project Board</h1>
          <p className="mt-2 text-slate-200">Manage workflow with real-time status updates.</p>
          <span className="mt-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-100">{totalTasks} tasks</span>
        </section>

        <section className="glass-card p-4">
          <form onSubmit={createTask} className="flex flex-col gap-2 sm:flex-row">
            <input className="input-base flex-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task title" />
            <button className="btn-primary whitespace-nowrap">Add task</button>
          </form>
          {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
        </section>

        <KanbanBoard tasks={tasks} onStatusChange={onStatusChange} />

        <section className="glass-card p-4">
          <h2 className="section-title mb-3">Live comments</h2>
          <select className="input-base mb-3" value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
            <option value="">Select task</option>
            {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          <div className="mb-3 max-h-52 space-y-2 overflow-auto">
            {comments.map((c) => <div key={c.id} className="rounded border border-white/20 bg-white/10 p-2 text-sm"><b>{c.user?.name || 'User'}:</b> {c.content}</div>)}
          </div>
          <div className="flex gap-2">
            <input className="input-base" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write comment..." />
            <button type="button" className="btn-primary" onClick={sendComment}>Send</button>
          </div>
        </section>
      </main>
    </div>
  );
}
