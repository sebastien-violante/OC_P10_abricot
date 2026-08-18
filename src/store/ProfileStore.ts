import { create } from 'zustand'
import type { Profile } from '@/types/types'

type ProfileStore = {
  profile: Profile | null
  setProfile: (profile: Profile) => void
  updateProfile: (updatedProfile: Profile) => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,

  setProfile: (profile) => set({ profile }),

  updateProfile: (updatedProfile) =>
    set({ profile: updatedProfile}),
}))