import { useState, useRef, useEffect } from 'react';
import { Task, useTaskStore } from '../store/useTaskStore';
import { Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { deleteTask } = useTaskStore();

  return (
    <div className={`task-card ${task.status === 'done' ? 'done-card' : ''}`}>
      <p className="card-title">{task.title}</p>
      {task.description && (
        <p className="card-description">{task.description}</p>
      )}
      <div className="card-footer">
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <button
          className="btn-delete"
          onClick={() => deleteTask(task.id)}
          title="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

interface AddTaskProps {
  status: Task['status'];
}

export const AddTaskInline = ({ status }: AddTaskProps) => {
  const { addTask } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask({ title: trimmed, description: '', status, priority: 'medium' });
    setTitle('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setTitle('');
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button className="btn-add-task" onClick={() => setOpen(true)}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Thêm thẻ
      </button>
    );
  }

  return (
    <div className="add-task-form">
      <textarea
        ref={textareaRef}
        placeholder="Nhập tiêu đề cho thẻ này..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="form-actions">
        <button className="btn-save-task" onClick={handleSave}>
          Thêm thẻ
        </button>
        <button className="btn-cancel-task" onClick={() => { setTitle(''); setOpen(false); }}>
          ✕
        </button>
      </div>
    </div>
  );
};
