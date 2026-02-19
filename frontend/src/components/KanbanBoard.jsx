const columns = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function KanbanBoard({ tasks, onStatusChange }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {columns.map((status) => (
        <div key={status} className="bg-white border rounded-lg p-4 min-h-64">
          <h3 className="font-semibold mb-3">{status.replace('_', ' ')}</h3>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} className="border rounded p-3 bg-slate-50">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.description}</p>
                  <select
                    className="mt-2 w-full border rounded p-1 text-sm"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                  >
                    {columns.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
