'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Profile, ProfileContextType } from '@/types/types'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import fetchProfile from '../utils/fetchProfile'

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  

  const loadProfile = async () => {
    const token = Cookies.get('token')
    if(!token) {
      setProfile(null)
      return
    }
    try {
          const profile = await fetchProfile({ token })
          setProfile(profile)
      } catch (error) {
          console.error(error);
          setProfile(null)
      } 
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('erreur de contexte')
  }

  return context
}