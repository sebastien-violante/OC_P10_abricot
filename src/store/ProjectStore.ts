import { create } from 'zustand'
import type { Project } from '@/types/types'

type ProjectStore = {
  projects: Project[]
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  getProjectById: (id: string) => Project | undefined
  updateProject: (project: Project) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  
  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id)
  },

   updateProject: (updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      ),
    })),
}))