import { TaskCard, AddTaskInline } from './TaskCard';
import { useTaskStore, TaskStatus } from '../store/useTaskStore';

const COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: 'Cần làm', status: 'todo' },
  { title: 'Đang làm', status: 'doing' },
  { title: 'Hoàn thành', status: 'done' },
];

export const KanbanBoard = () => {
  const { tasks, searchQuery } = useTaskStore();

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

            <div className="cards-container">
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
