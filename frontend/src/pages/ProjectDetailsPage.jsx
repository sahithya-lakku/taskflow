import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await api.get(`/tasks/project/${projectId}`);
      setTasks(data.data);
    };

    fetchTasks();
    const socket = getSocket(token);
    socket.emit('project:join', projectId);

    socket.on('task:created', (task) => setTasks((prev) => [task, ...prev]));
    socket.on('task:updated', (task) => setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t))));
    socket.on('task:deleted', ({ id }) => setTasks((prev) => prev.filter((t) => t.id !== id)));

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [projectId, token]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    await api.post(`/tasks/project/${projectId}`, { title });
    setTitle('');
  };

  const onStatusChange = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}`, { status });
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Project Board</h1>
        <form onSubmit={createTask} className="flex gap-2">
          <input className="border rounded p-2 flex-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task title" />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add task</button>
        </form>
        <KanbanBoard tasks={tasks} onStatusChange={onStatusChange} />
      </main>
    </div>
  );
}
