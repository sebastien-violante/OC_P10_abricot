'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Profile, ProfileContextType } from '@/types/types'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import fetchProfile from '../utils/fetchProfile'

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  

  useEffect(() => {

    const token = Cookies.get('token')
    if(!token) return
    const authToken = token;
    async function loadProfile() {
      try {
          const profile = await fetchProfile({ token: authToken })
          setProfile(profile)
      } catch (error) {
          console.error(error);
      } 
    }
    
    loadProfile()
  }, [])
  
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
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