import { TaskCard, AddTaskInline } from './TaskCard';
import { useTaskStore, TaskStatus } from '../store/useTaskStore';
import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../store/useTaskStore';

const COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: 'Cần làm', status: 'todo' },
  { title: 'Đang làm', status: 'doing' },
  { title: 'Hoàn thành', status: 'done' },
];

// Wrapper component for sortable cards
const SortableTaskCard = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard task={task} listeners={listeners} attributes={attributes} />
    </div>
  );
};

export const KanbanBoard = () => {
  const { tasks, searchQuery, moveTask } = useTaskStore();
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event: any) => {
    setDraggedTask(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id as string;
    const overTaskId = over.id as string;

    if (activeTaskId === overTaskId) return;

    // Find tasks and their positions
    const activeTask = tasks.find((t) => t.id === activeTaskId);
    const overTask = tasks.find((t) => t.id === overTaskId);

    if (!activeTask || !overTask) return;

    const activeStatus = activeTask.status;
    const overStatus = overTask.status;

    // Get all tasks in both statuses
    const tasksInActiveStatus = tasks.filter((t) => t.status === activeStatus);
    const tasksInOverStatus = tasks.filter((t) => t.status === overStatus);

    const activeIndex = tasksInActiveStatus.findIndex((t) => t.id === activeTaskId);
    const overIndex = tasksInOverStatus.findIndex((t) => t.id === overTaskId);

    moveTask(activeTaskId, overStatus, overIndex);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board-container">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          const colTasksAll = tasks.filter((t) => t.status === col.status);
          
          return (
            <div key={col.status} className="kanban-column">
              <div className="column-header">
                <h2 className="column-title">{col.title}</h2>
                <span className="column-count">{colTasks.length}</span>
              </div>

              <div className="cards-container">
                <SortableContext
                  items={colTasksAll.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {colTasks.map((task) => (
                    <SortableTaskCard key={task.id} task={task} />
                  ))}
                </SortableContext>
              </div>

              <AddTaskInline status={col.status} />
            </div>
          );
        })}

        <button className="btn-add-column">
          <span style={{ fontSize: 18 }}>+</span> Thêm danh sách khác
        </button>
      </div>
      <DragOverlay>
        {draggedTask ? (
          <div className="dragging">
            <TaskCard task={tasks.find((t) => t.id === draggedTask)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
