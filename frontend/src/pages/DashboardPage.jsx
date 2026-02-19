import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useProjectStore } from '../store/projectStore';

export default function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const setProjects = useProjectStore((s) => s.setProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data.data);
      setLoading(false);
    };
    fetchProjects();
  }, [setProjects]);

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {loading ? <p>Loading projects...</p> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="p-4 border rounded bg-white hover:shadow">
                <h2 className="font-semibold">{project.name}</h2>
                <p className="text-sm text-slate-500">{project.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
