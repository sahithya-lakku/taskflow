import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => { api.get('/bookmark').then(({ data }) => setBookmarks(data.data || [])); }, []);
  return <div><Navbar /><main className="mx-auto max-w-5xl px-4 py-6"><h1 className="section-title mb-3">Bookmarks</h1><div className="space-y-2">{bookmarks.map((b)=> <div key={b.id} className="glass-card">{b.task?.title || b.project?.name || 'Bookmark'}</div>)}</div></main></div>;
}
