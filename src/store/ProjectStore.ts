import { create } from 'zustand'
import type { Project } from '@/types/types'

type ProjectStore = {
  projects: Project[]
  setProjects: (projects: Project[]) => void
  getProjectById: (id: string) => Project | undefined
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],

  setProjects: (projects) => set({ projects }),

  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id)
  },
}))