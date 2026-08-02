import { create } from 'zustand'
import type { Task } from '@/types/types'

type SelectedTaskStore = {
  task: Task | null
  setTask: (task: Task) => void
  removeTask: () => void
}

export const useSelectedTask= create<SelectedTaskStore>((set) => ({
  task: null,

  setTask: (task) => set({ task }),

  removeTask: () => set({ task:  null}),

}))