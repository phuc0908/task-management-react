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
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => void;
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
        },
      ],
      addTask: (task) => {
        set((state) => {
          const newTask = {
            ...task,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: Date.now(),
          };
          return {
            tasks: [...state.tasks, newTask],
          };
        });
      },
      moveTask: (taskId, newStatus, newIndex) => {
        set((state) => {
          const allTasks = [...state.tasks];
          const taskIndex = allTasks.findIndex((t) => t.id === taskId);
          
          if (taskIndex === -1) return state;
          
          const task = allTasks[taskIndex];
          const oldStatus = task.status;
          
          // Remove task from array
          allTasks.splice(taskIndex, 1);
          
          // Update status
          task.status = newStatus;
          
          // Find insertion point in new status
          const tasksInNewStatus = allTasks.filter((t) => t.status === newStatus);
          if (tasksInNewStatus.length === 0) {
            allTasks.push(task);
          } else {
            const targetTask = tasksInNewStatus[newIndex];
            const insertIdx = allTasks.indexOf(targetTask);
            allTasks.splice(insertIdx, 0, task);
          }
          
          return { tasks: allTasks };
        });
      },
      deleteTask: (id) => {
        set((state) => {
          console.log('deleteTask called with id:', id);
          console.log('Current tasks:', state.tasks);
          const filtered = state.tasks.filter((t) => t.id !== id);
          console.log('After deletion:', filtered);
          return {
            tasks: filtered,
          };
        });
      },
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'task-storage',
      version: 1,
    }
  )
);
