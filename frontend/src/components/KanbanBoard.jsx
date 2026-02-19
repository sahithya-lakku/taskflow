const columns = ['TODO', 'IN_PROGRESS', 'DONE'];

const columnStyles = {
  TODO: 'from-slate-600/35 to-slate-700/20 border-slate-300/20',
  IN_PROGRESS: 'from-amber-500/20 to-orange-500/10 border-amber-300/30',
  DONE: 'from-emerald-500/20 to-teal-500/10 border-emerald-300/30',
};

export default function KanbanBoard({ tasks, onStatusChange }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((status) => {
        const filteredTasks = tasks.filter((task) => task.status === status);

        return (
          <section key={status} className={`glass-card border bg-gradient-to-b p-4 ${columnStyles[status]}`}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">{status.replace('_', ' ')}</h3>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs text-slate-200">
                {filteredTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {filteredTasks.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/20 p-4 text-sm text-slate-300">
                  No tasks yet in this column.
                </div>
              )}

              {filteredTasks.map((task) => (
                <article key={task.id} className="rounded-xl border border-white/20 bg-slate-950/40 p-3 shadow-lg shadow-slate-950/30 transition hover:-translate-y-0.5 hover:bg-slate-950/60">
                  <p className="font-semibold text-white">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{task.description || 'No description provided.'}</p>
                  <select
                    className="mt-3 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm text-white outline-none"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                  >
                    {columns.map((option) => (
                      <option key={option} value={option} className="bg-slate-900 text-white">
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
