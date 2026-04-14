import { useState, useRef, useEffect } from 'react';
import { Task, useTaskStore } from '../store/useTaskStore';
import { Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { deleteTask } = useTaskStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId: task.id,
      fromStatus: task.status,
    }));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`task-card ${task.status === 'done' ? 'done-card' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          title="Delete task"
          draggable={false}
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

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask({ title: trimmed, description: '', status, priority: 'medium' });
    setTitle('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = title.trim();
      if (trimmed) {
        addTask({ title: trimmed, description: '', status, priority: 'medium' });
        setTitle('');
        setOpen(false);
      }
    }
    if (e.key === 'Escape') {
      setTitle('');
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button className="btn-add-task" onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Thêm thẻ
      </button>
    );
  }

  return (
    <div className="add-task-form" onMouseDown={(e) => e.stopPropagation()}>
      <textarea
        ref={textareaRef}
        placeholder="Nhập tiêu đề cho thẻ này..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        draggable={false}
      />
      <div className="form-actions">
        <button className="btn-save-task" onClick={handleSave}>
          Thêm thẻ
        </button>
        <button className="btn-cancel-task" onClick={(e) => { e.stopPropagation(); setTitle(''); setOpen(false); }}>
          ✕
        </button>
      </div>
    </div>
  );
};
