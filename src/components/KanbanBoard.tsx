import { TaskCard, AddTaskInline } from './TaskCard';
import { useTaskStore, TaskStatus } from '../store/useTaskStore';
import { useState } from 'react';

const COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: 'Cần làm', status: 'todo' },
  { title: 'Đang làm', status: 'doing' },
  { title: 'Hoàn thành', status: 'done' },
];

export const KanbanBoard = () => {
  const { tasks, searchQuery, updateTaskStatus } = useTaskStore();
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="board-container">
      {COLUMNS.map((col) => {
        const colTasks = filteredTasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="kanban-column">
            <div className="column-header">
              <h2 className="column-title">{col.title}</h2>
              <span className="column-count">{colTasks.length}</span>
            </div>

            <div
              className={`cards-container ${dragOverStatus === col.status ? 'drag-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';
                setDragOverStatus(col.status);
              }}
              onDragLeave={() => {
                setDragOverStatus(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOverStatus(null);
                
                try {
                  const data = JSON.parse(e.dataTransfer.getData('application/json'));
                  if (data.taskId) {
                    updateTaskStatus(data.taskId, col.status);
                  }
                } catch (error) {
                  console.error('Invalid drag data:', error);
                }
              }}
            >
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            <AddTaskInline status={col.status} />
          </div>
        );
      })}

      <button className="btn-add-column">
        <span style={{ fontSize: 18 }}>+</span> Thêm danh sách khác
      </button>
    </div>
  );
};
