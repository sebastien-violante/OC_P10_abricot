import { create } from 'zustand'
import type { Task } from '@/types/types'

type TaskStore = {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  getTaskById: (id: string) => Task | undefined
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  removeTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id)
  },

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId)
    })),

  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),

}))