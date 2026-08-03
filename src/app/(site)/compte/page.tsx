'use client'

import { useProfile } from '@/app/context/profileContext'
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import type { UserFormData } from '@/types/types'
import { SubmitEvent } from 'react'
import { userSchema } from '@/types/schemas/userSchema'
import Cookies from 'js-cookie'
import putRequest from '@/app/utils/putRequest'

export default function Account() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordZoneOpen, setPasswordOpen] = useState(false)
    const { profile, setProfile } = useProfile()
    const firstName = profile?.name.split(' ')[0]
    const lastName = profile?.name.split(' ')[1]
    const [userFormData, setUserFormData] = useState<UserFormData>(
        {
            lastName: "",
            firstName: "",
            email: ""
        }
    )

    useEffect(() => {
        if(profile) {
        setUserFormData({
            lastName: profile.name.split(' ')[1],
            firstName: profile.name.split(' ')[0],
            email: profile.email
            })
        }
    }, [profile])

    async function handleSubmit (event: SubmitEvent<HTMLFormElement>) {
        
        event.preventDefault()
        // validation des données par Zod
        const zodValidation = userSchema.safeParse(userFormData);
        if(zodValidation.success) {
            // Création de la payload
            const payload = {
                name: `${userFormData.firstName} ${userFormData.lastName}`,
                email: userFormData.email
            }
            // Vérification de la connexion de l'utilisateur
            const token = Cookies.get('token')
            if(token) {
                const url = "api/auth/profile"
               
                const result = await putRequest({ url,token,payload })
                const response = await result.json()
                console.log(response)
                if(response.success) {
                    setSuccessMessage(response.message); 
                } else {
                    setErrorMessage(response.message);
                }
                setTimeout(() => {
                    setSuccessMessage("")
                    setErrorMessage("")
                }, 3000);
            }
        }
    }
                
    const showPasswordZone = () => {
        setPasswordOpen(prev => !prev)
    }
                



    return (
        <div className={styles.accountWrapper}>
            <section className={styles.header}>
                Mon compte
                <span>{profile?.name}</span>
            </section>
            
            <form className={styles.data} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor='lastName'>Nom</label>
                    <input 
                        type="text" 
                        name="lastName" 
                        id="lastName" 
                        value={userFormData.lastName}
                        onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})} 
                        required/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor='firstname'>Prénom</label>
                    <input 
                        type="text" 
                        name="firstname" 
                        id="firstname" 
                        value={userFormData.firstName} 
                        onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})} 
                        required /> 
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} 
                        required />
                </div>
                <div className={styles.cta}>
                    <button type="submit">Modifier les informations</button>
                </div>
            </form>
            <button onClick={showPasswordZone}>Modifier le mot de passe</button>

            { passwordZoneOpen && 
                <form className={styles.password}>
                    <div className={styles.formGroup}>
                        <label htmlFor='lastPassword'>Mot de passe actuel</label>
                        <input 
                            type="password" 
                            name="lastPassword" 
                            id="lastPassword" 
                            required /> 
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor='newPassword'>Nouveau mot de passe</label>
                        <input 
                            type="password" 
                            name="newPassword" 
                            id="newPassword" 
                            required /> 
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor='confirmPassword'>Confirmation du nouveau mot de passe</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            id="confirmPassword" 
                            required /> 
                    </div>
                    <div className={styles.cta}>
                        <button type="submit">Modifier le mot de passe</button>
                    </div>
                </form>
            }  
            
            
            {successMessage && (
                <div className="fixed top-5 right-5 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="fixed top-5 right-5 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg">
                    {errorMessage}
                </div>
            )}
        </div>
    )
}