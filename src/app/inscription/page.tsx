'use client' 

import { z } from "zod";
import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitEvent, ChangeEvent } from 'react'
import { RegistrationFormData } from '../../types/types'
import { registerSchema } from '@/types/schemas/registerSchema'
import type { FlashMessage } from "../../types/types";
import postRequest from "../utils/postRequest";

export default function Registration() {

    const router = useRouter()
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
    const [errors, setErrors] = useState<z.core.$ZodIssue[]>([])
    
    // Initilisation des données du formulaire d'enregistrement
    const [formData, setFormData] = useState<RegistrationFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    // Captation des données d'enregistrement dans FormData
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target 
        setFormData((prev) => ({...prev, [name]: value}))
    }
    // Récupération de l'erreur correspondant à un champ 
    const getFieldError = (fieldName: string) => { 
        return errors.find((error) => error.path.includes(fieldName)) 
    }

    // Soumission du formulaire
    async function handleSubmit (event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrors([])
        
        // Validation des données par Zod
        const zodValidation = registerSchema.safeParse(formData)
        if(!zodValidation.success) {
            setErrors(zodValidation.error.issues)
            return
        }

        // Création de la payload
        const payload = {
            email: formData.email.trim(),
            password: formData.password,
            name: formData.firstName.trim()+' '+formData.lastName.trim()
        }
        
        // Envoi de la requête
        try {
            const data = await postRequest({
                url: "/api/auth/register",
                payload 
            })
            setFlashMessage({status: true, message: data.message})
            setTimeout(() => {
                setFlashMessage(null)
                router.push('/')
            }, 2000);     
        } catch(error) {

            const apiError = error as { 
                status?: number; 
                message?: string; 
                details?: { 
                    field: string; 
                    message: string; }[]; 
            }; 
            
            // Erreur de validation API 
            if (apiError.status === 400) { 
                setFlashMessage({ status: false, message: "Données invalides.", })
                return; 
            } 
            // Email déjà utilisé 
            if (apiError.status === 409) { 
                setFlashMessage({ status: false, message: "Cette adresse email est déjà utilisée.", })
                return 
            } 
            // Autre erreur 
            setFlashMessage({ status: false, message: "Une erreur est survenue. Veuillez réessayer.", }) 
            setTimeout(() => { setFlashMessage(null); }, 3000);
        }    
    }   
    
    return (
        <>
            <div className={styles.loginBackground}>
                <Image 
                    className={styles.backgroundImage} 
                    src="/pictures/static/login.png" 
                    alt="affaires scolaires posées sur un bureau" 
                    fill 
                    priority/>
                <section 
                    className={styles.register}
                    aria-labelledby="registration-title">
                    <img 
                        className={styles.loginLogo} 
                        src="/pictures/static/logo-orange.svg"
                        alt="abricot"/>
                    <form 
                        className={styles.registerForm} 
                        onSubmit={handleSubmit}
                        noValidate>
                        <h1 className={styles.formTitle}
                            id="registration-title">Inscription</h1>
                        <section className={styles.formGroup}>
                            <label htmlFor="firstName">Prénom</label>
                            <input 
                                type="text" 
                                id="firstName"
                                name="firstName"
                                autoComplete="given-name"
                                onChange={handleChange}
                                required 
                                aria-invalid={!!getFieldError("firstName")} 
                                aria-describedby={ getFieldError("firstName") ? "firstName-error" : undefined }
                            />
                            {getFieldError("firstName") && ( 
                                <p 
                                    id="firstName-error" 
                                    className={styles.fieldError} 
                                    role="alert"> 
                                    {getFieldError("firstName")?.message} 
                                </p> 
                            )}
                        </section>
                        <section className={styles.formGroup}>
                            <label htmlFor="lastName">Nom</label>
                            <input 
                                type="text" 
                                id="lastName"
                                name="lastName"
                                autoComplete="family-name"
                                onChange={handleChange}
                                required 
                                aria-invalid={!!getFieldError("lastName")} 
                                aria-describedby={ getFieldError("lastName") ? "lastName-error" : undefined }
                            />
                            {getFieldError("lastName") && ( 
                                <p 
                                    id="lastName-error" 
                                    className={styles.fieldError} 
                                    role="alert" 
                                    > {getFieldError("lastName")?.message} 
                                </p> 
                            )}
                        </section>
                         <section className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                autoComplete="email"
                                name="email"
                                onChange={handleChange}
                                required 
                                aria-invalid={!!getFieldError("email")} 
                                aria-describedby={ getFieldError("email") ? "email-error" : undefined }
                            />
                            {getFieldError("email") && ( 
                                <p 
                                    id="email-error" 
                                    className={styles.fieldError} 
                                    role="alert" > {getFieldError("email")?.message} 
                                </p> 
                            )}
                        </section>
                        <section className={styles.formGroup}>
                            <label htmlFor="password">Mot de passe</label>
                            <input 
                                type="password" 
                                id="password"
                                autoComplete="password"
                                name="password" 
                                onChange={handleChange}
                                required 
                                aria-invalid={!!getFieldError("password")} 
                                aria-describedby={ getFieldError("password") ? "password-error" : undefined }
                            />
                            {getFieldError("password") && ( 
                                <p 
                                    id="password-error" 
                                    className={styles.fieldError} 
                                    role="alert" > {getFieldError("password")?.message} 
                                </p> 
                            )}
                        </section>
                        <div className={styles.buttonCenter}>
                            <button className={styles.btnSubmit} type="submit">S'inscrire</button>
                        </div>
                    </form>
                    <p>Déja inscrit ? <Link className={styles.registerLink} href="/">Se connecter</Link></p>
                </section>
            </div> 
            {flashMessage && (
                <div  
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg ${flashMessage.status ? "bg-green-500" : "bg-red-500"} px-6 py-4 text-white shadow-lg`}
                    role={ flashMessage.status ? 'status' : 'alert' } 
                    aria-live={ flashMessage.status ? 'polite' : 'assertive' }
                >
                    {flashMessage.message}
                </div>
            )}           
        </>
    )
}