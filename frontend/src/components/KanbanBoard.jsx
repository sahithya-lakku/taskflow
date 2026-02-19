import { AlertTriangle } from 'lucide-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const columns = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED'];
const colors = {
  TODO: 'from-slate-200 to-slate-100',
  IN_PROGRESS: 'from-indigo-100 to-blue-100',
  REVIEW: 'from-fuchsia-100 to-pink-100',
  DONE: 'from-emerald-100 to-green-100',
  BLOCKED: 'from-rose-100 to-red-100',
};

const priorityBadge = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
};

export default function KanbanBoard({ tasks, onStatusChange, onReorder }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;
    const statusTasks = tasks.filter((t) => t.status === sourceStatus);
    const moved = statusTasks[result.source.index];
    if (!moved) return;
    onStatusChange(moved.id, destStatus);
    if (onReorder) onReorder(moved.id, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 xl:grid-cols-5">
        {columns.map((status) => {
          const filtered = tasks.filter((task) => task.status === status);
          return (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <section ref={provided.innerRef} {...provided.droppableProps} className={`glass-card bg-gradient-to-b ${colors[status]}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{status.replace('_', ' ')}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs">{filtered.length}</span>
                  </div>

                  <div className="space-y-3">
                    {filtered.map((task, idx) => {
                      const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
                      return (
                        <Draggable draggableId={task.id} index={idx} key={task.id}>
                          {(dragProvided, snapshot) => (
                            <article
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`relative rounded-xl border bg-white p-3 shadow-sm transition ${snapshot.isDragging ? 'scale-[1.02] shadow-lg' : ''} ${overdue ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'}`}
                            >
                              <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${status === 'DONE' ? 'bg-emerald-500' : status === 'REVIEW' ? 'bg-fuchsia-500' : status === 'BLOCKED' ? 'bg-red-500' : 'bg-indigo-500'}`} />
                              <p className="pl-2 font-semibold">{task.title}</p>
                              <p className="pl-2 text-sm text-slate-600">{task.description || 'No description provided.'}</p>

                              <div className="mt-2 flex flex-wrap gap-1 pl-2">
                                {(task.tags || []).map((t) => (
                                  <span key={t.tag.id} className="rounded-full px-2 py-0.5 text-xs text-white" style={{ backgroundColor: t.tag.color }}>{t.tag.name}</span>
                                ))}
                              </div>

                              <div className="mt-2 flex items-center justify-between pl-2 text-xs">
                                {task.assignedTo?.name && <span className="rounded-full bg-slate-100 px-2 py-0.5">👤 {task.assignedTo.name}</span>}
                                <span className={`rounded px-2 py-0.5 ${priorityBadge[task.priority || 'MEDIUM']}`}>{task.priority || 'MEDIUM'}</span>
                                {task.dueDate && <span className="rounded bg-slate-100 px-2 py-0.5">{new Date(task.dueDate).toLocaleDateString()}</span>}
                                {overdue && <AlertTriangle size={14} className="text-red-500" />}
                              </div>
                            </article>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                </section>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
