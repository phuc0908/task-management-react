import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: '1',
          title: 'Welcome to Aura Tasks',
          description: 'Try dragging this card to another column.',
          status: 'todo',
          priority: 'high',
          createdAt: Date.now(),
        },
        {
          id: '2',
          title: 'Premium Design System',
          description: 'Explore the glassmorphism and neon gradients.',
          status: 'doing',
          priority: 'medium',
          createdAt: Date.now(),
        }
      ],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substring(2, 9),
              createdAt: Date.now(),
            },
          ],
        })),
      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'task-storage',
    }
  )
);
