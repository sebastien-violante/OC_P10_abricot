'use client'

import { z } from "zod";
import { useEffect, useState, SubmitEvent } from 'react'
import styles from './page.module.css'
import Cookies from 'js-cookie'

import type { UserFormData, UserPasswordFormData, FlashMessage, UpdateProfileResponse } from '@/types/types'

import putRequest from '@/app/utils/putRequest'

import { useProfile } from '@/app/context/profileContext'
import { userSchema } from '@/types/schemas/userSchema'
import { userPasswordSchema } from '@/types/schemas/userPasswordSchema'
import { useProfileStore } from "@/store/ProfileStore";

import PasswordInput from '@/components/PasswordInput/PasswordInput'

export default function Account() {
    
    const { profile } = useProfile()
    
    const [errors, setErrors] = useState<z.ZodIssue[]>([])
    const [apiResponse, setApiResponse] = useState("")
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
    const [passwordZoneOpen, setPasswordOpen] = useState(false)
    const [userFormData, setUserFormData] = useState<UserFormData>({lastName: "",firstName: "",email: ""})
    const [userPasswordFormData, setUserPasswordFormData] = useState<UserPasswordFormData>({currentPassword: "",newPassword: "",confirmPassword: ""})
    
    // Recherche des erreurs zod par champ
    const getFieldErrors = (fieldName: string) => { 
        return errors.filter( (error) => error.path[0] === fieldName ) 
    } 
    // Définition des deux erreurs de champs possibles
    const emailErrors = getFieldErrors('email') 
    const lastNameErrors = getFieldErrors('lastName')
    const firstNameErrors = getFieldErrors('firstName')
    const currentPasswordErrors = getFieldErrors('currentPassword')
    const newPasswordErrors = getFieldErrors('newPassword')

    const profileInStore = useProfileStore((state) => state.profile)
    const setProfileInStore = useProfileStore((state) => state.setProfile)

    // Chargement des données dans le formulaire à partir des informations du profile
    useEffect(() => {
        if(profile) {
            setUserFormData({
                lastName: profile.name.split(' ')[1],
                firstName: profile.name.split(' ')[0],
                email: profile.email
                })
            }
            setProfileInStore(profile!)
    }, [profile, setProfileInStore])


    async function changeData (event: SubmitEvent<HTMLFormElement>) {
        
        event.preventDefault()
        setErrors([])
        setApiResponse("")
        // validation des données par Zod
        const zodValidation = userSchema.safeParse(userFormData)
        if(!zodValidation.success) {
            setErrors(zodValidation.error.issues)
            return;
        }
        // Création de la payload
        const payload = {
            name: `${userFormData.firstName} ${userFormData.lastName}`,
            email: userFormData.email
        }
        // Vérification de la connexion de l'utilisateur
        const token = Cookies.get('token')
        if(token) {
            try {
                const url = "api/auth/profile"
                const result = await putRequest<typeof payload, UpdateProfileResponse>({ url,token,payload })
                if(result.data) {
                   const newProfile = {
                    id: result.data.user.id,
                    email: result.data.user.email,
                    name: result.data.user.name
                    }
                    setProfileInStore(newProfile)
                }
                setFlashMessage({ status: true, message: "Le compte a bien été modifié", }) 
                setTimeout(() => {setFlashMessage(null)}, 2000);
            } catch(error) {
                setApiResponse(error instanceof Error ? error.message : typeof error === "object" && error !== null && "message" in error  ? String(error.message) : "Une erreur est survenue.")
            }
        }
        
    }
                
    const showPasswordZone = () => {
        setPasswordOpen(prev => !prev)
    }
                
    async function changePassword(event: SubmitEvent<HTMLFormElement>){
        
        event.preventDefault()
        setErrors([])
        if(userPasswordFormData.newPassword === userPasswordFormData.confirmPassword) {
           
            // validation des données par Zod
            const zodValidation = userPasswordSchema.safeParse(userPasswordFormData)
            if(!zodValidation.success) {
                setErrors(zodValidation.error.issues)
                return;
            }
            const payload = {
                currentPassword: userPasswordFormData.currentPassword,
                newPassword: userPasswordFormData.newPassword
            }
            const token = Cookies.get('token')
            if(token) {
                try {
                    const url = "api/auth/password"
                    const result = await putRequest({ url, token, payload })
                    setFlashMessage({ status: true, message: "Le mot de passe a bien été modifié", }) 
                    setTimeout(() => {setFlashMessage(null)}, 2000);
                } catch(error) {
                    const message = error instanceof Error ? error.message : "Une erreur est survenue";
                    setFlashMessage({ status: false, message: message }) 
                    setTimeout(() => {setFlashMessage(null)}, 2000);
                } 
            } else {
                setFlashMessage({status: false, message: "Les mots de passe saisis ne respectent pas les règles prescrites"})
                setTimeout(() => {setFlashMessage(null)}, 3000);
            }
        } else {
            setFlashMessage({status: false, message: "Le nouveau mot de passe et sa confirmation doivent être identiques"})
            setTimeout(() => {setFlashMessage(null)}, 3000);
        }
    }


    return (
        <div className={styles.accountWrapper}>
            <section className={styles.header}>
                Mon compte
                <span>{profileInStore?.name}</span>
            </section>
            {apiResponse && (
                <p
                    className={styles.apiResponse}
                    role="status"
                    aria-live="polite"
                >
                    {apiResponse}
                </p>
            )}
            <form className={styles.data} onSubmit={changeData}>
                <div className={styles.formGroup}>
                    <label htmlFor='lastName'>Nom</label>
                    <input 
                        type="text" 
                        name="lastName" 
                        id="lastName" 
                        value={userFormData.lastName}
                        onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})} 
                        required/>
                    {lastNameErrors.length > 0 && ( 
                        <p id="account-lastName-error" className={styles.fieldError} > {lastNameErrors[0].message} </p> 
                    )}   
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
                        {firstNameErrors.length > 0 && ( 
                                <p id="account-firstName-error" className={styles.fieldError} > {firstNameErrors[0].message} </p> 
                            )} 
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
                        {emailErrors.length > 0 && ( 
                                <p id="login-email-error" className={styles.fieldError} > {emailErrors[0].message} </p> 
                            )}
                </div>
                <div className={styles.cta}>
                    <button type="submit" className={styles.ctaButton}>Modifier les informations</button>
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
                    {currentPasswordErrors.length > 0 && ( 
                        <p id="account-currentPassword-error" className={styles.fieldError} > {currentPasswordErrors[0].message} </p> 
                    )} 
                    <PasswordInput
                        name="newPassword"
                        label="Nouveau mot de passe"
                        userPasswordFormData={userPasswordFormData}
                        setUserPasswordFormData={setUserPasswordFormData}
                    />
                    {newPasswordErrors.length > 0 && ( 
                        <p id="account-newPassword-error" className={styles.fieldError} > {newPasswordErrors[0].message} </p> 
                    )} 
                    <PasswordInput
                        name="confirmPassword"
                        label="Confirmation du nouveau mot de passe"
                        userPasswordFormData={userPasswordFormData}
                        setUserPasswordFormData={setUserPasswordFormData}
                    />
                    <div className={styles.cta}>
                        <button type="submit" className={styles.ctaButton}>Modifier le mot de passe</button>
                    </div>
                </form>
            }  

            {/* MESSAGE GLOBAL */}
            {flashMessage && (
                <div  
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg ${flashMessage.status ? "bg-green-500" : "bg-red-500"} px-6 py-4 text-white shadow-lg`}
                    role={ flashMessage.status ? 'status' : 'alert' } 
                    aria-live={ flashMessage.status ? 'polite' : 'assertive' }
                >
                    {flashMessage.message}
                </div>
            )}
        </div>
    )
}