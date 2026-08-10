import { create } from 'zustand'
import type { Project } from '@/types/types'

type SelectedProjectStore = {
  project: Project | null
  setProject: (project: Project) => void
  updateProject: (updatedProject: Project) => void
}

export const useSelectedProject = create<SelectedProjectStore>((set) => ({
  project: null,

  setProject: (project) => set({ project }),

  updateProject: (updatedProject) =>
    set({ project: updatedProject }),
}))