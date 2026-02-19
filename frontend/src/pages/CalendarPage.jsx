import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  const load = async () => {
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    const { data } = await api.get(`/calendar/tasks/calendar?startDate=${start.toISOString()}&endDate=${end.toISOString()}`);
    setEvents((data.data || []).map((t) => ({ id: t.id, title: t.title, start: t.dueDate, backgroundColor: t.status === 'BLOCKED' ? '#ef4444' : t.status === 'REVIEW' ? '#d946ef' : undefined })));
  };

  useEffect(() => { load(); }, []);

  const onDrop = async (info) => {
    await api.patch(`/calendar/tasks/${info.event.id}/reschedule`, { dueDate: info.event.start.toISOString() });
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6"><div className="glass-card"><FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="dayGridMonth" editable events={events} eventDrop={onDrop} height="75vh" /></div></main>
    </div>
  );
}
