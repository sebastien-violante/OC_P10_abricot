'use client'

import { useProfile } from '@/app/context/profileContext'
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import type { UserFormData } from '@/types/types'
import type { UserPasswordFormData } from '@/types/types'
import { SubmitEvent } from 'react'
import { userSchema } from '@/types/schemas/userSchema'
import { userPasswordSchema } from '@/types/schemas/userPasswordSchema'
import Cookies from 'js-cookie'
import putRequest from '@/app/utils/putRequest'
import PasswordInput from '@/components/PasswordInput/PasswordInput'

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

    const [userPasswordFormData, setUserPasswordFormData] = useState<UserPasswordFormData>(
        {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    )
    console.log(userPasswordFormData)
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
                
    async function changePassword(event: SubmitEvent<HTMLFormElement>){
        
        event.preventDefault()
        console.log(userPasswordFormData)
        if(userPasswordFormData.newPassword === userPasswordFormData.confirmPassword) {
            // validation des données par Zod
            const zodValidation = userPasswordSchema.safeParse(userPasswordFormData)
            console.log(zodValidation)
            if(zodValidation.success) {
                const payload = {
                    currentPassword: userPasswordFormData.currentPassword,
                    newPassword: userPasswordFormData.newPassword
                }
                const token = Cookies.get('token')
                if(token) {
                    const url = "api/auth/password"
                    const result = await putRequest({ url,token,payload })
                    const response = await result.json()
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
            } else {
                setErrorMessage("Les mots de passe saisis ne respectent pas les règles prescrites")
                setTimeout(() => {
                setErrorMessage("")
            }, 3000);
            }
        } else {
            setErrorMessage("Le nouveau mot de passe et sa confirmation doivent être identiques")
            setTimeout(() => {
                setErrorMessage("")
            }, 3000);
        }
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
                <form className={styles.password} onSubmit={changePassword}>
                    <PasswordInput
                        name="currentPassword"
                        label="Mot de passe actuel"
                        userPasswordFormData={userPasswordFormData}
                        setUserPasswordFormData={setUserPasswordFormData}
                    />
                    <PasswordInput
                        name="newPassword"
                        label="Nouveau mot de passe"
                        userPasswordFormData={userPasswordFormData}
                        setUserPasswordFormData={setUserPasswordFormData}
                    />
                    <PasswordInput
                        name="confirmPassword"
                        label="Confirmation du nouveau mot de passe"
                        userPasswordFormData={userPasswordFormData}
                        setUserPasswordFormData={setUserPasswordFormData}
                    />
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