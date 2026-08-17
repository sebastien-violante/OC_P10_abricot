'use client' 

import { z } from "zod";
import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useState, SubmitEvent, ChangeEvent  } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie"
import { AuthFormData, FlashMessage, LoginResponseData } from '../types/types'
import { useProfile } from './context/profileContext'
import Modal from '@/components/Modal/Modal'
import { authSchema } from '@/types/schemas/authSchema'
import postRequest, {ApiResponse} from "./utils/postRequest";

export default function Login() {
    
    const { loadProfile } = useProfile()
    const router = useRouter()
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [errors, setErrors] = useState<z.ZodIssue[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // AUTHENTIFICATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Composition des données de formulaire d'authentification
    const [formData, setFormData] = useState<AuthFormData>({
        email: "",
        password: "",
    });

    // Captation des données d'authentification dans FormData
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target 
        setFormData((prev) => ({...prev, [name]: value}))
    }

    // Recherche des erreurs zod par champ
    const getFieldErrors = (fieldName: string) => { 
        return errors.filter( (error) => error.path[0] === fieldName ) 
    } 
    // Définition des deux erreurs de champs possibles
    const emailErrors = getFieldErrors('email') 
    const passwordErrors = getFieldErrors('password')
    
    
    // Soumission du formulaire
    async function handleSubmit (event: SubmitEvent<HTMLFormElement>) {   
        event.preventDefault()
        // Remise à zéro des erreurs
        setErrors([])
        setFlashMessage(null)
        // Validation Zod
        const zodValidation = authSchema.safeParse(formData)
        if(!zodValidation.success) {
            setErrors(zodValidation.error.issues)
            return
        }
        // Création de la payload
        const payload = {
            email: formData.email.trim(),
            password: formData.password.trim()
        }
        // Passage à l'état soumission de formulaire
        setIsSubmitting(true)

        // Envoi de la requête
        try {
            const data = await postRequest({
                url: "/api/auth/login",
                payload 
            }) as ApiResponse<LoginResponseData>

            // Réponse sans token
            if (!data.data?.token) {
                throw new Error("Token manquant dans la réponse");
            } else 
            // Token ok, mise en cookie et redirection  
            {
                Cookies.set('token', data.data.token, {
                    expires: 1 / 24,
                    secure: true,
                    sameSite: 'strict',
                });
                await loadProfile()
                router.push('/dashboard')
            }

        // Erreur renvoyée par l'API
        } catch(error) {
            const apiError = error as { 
                status?: number; 
                message?: string; 
                details?: { 
                    field: string; 
                    message: string; }[]; 
            }; 
            
            // Erreur de validation API 
            if (apiError.status === 401) { 
                setFlashMessage({ status: false, message: "Les identifiants sont invalides.", })
                setTimeout(() => {setFlashMessage(null)}, 2000);
                return; 
            } 
            // Autre erreur 
            setFlashMessage({ status: false, message: "Une erreur est survenue. Veuillez réessayer.", }) 
                setTimeout(() => {setFlashMessage(null)}, 2000);

        } finally {
            // SOrtie du mode soumission de formulaire
            setIsSubmitting(false)
        }
    }  
    
    // REINITIALISATION DU MOT DE PASSE ///////////////////////////////////////////////////////////////////////////////////////

    // Variable servant à l'ouverture de la modale
    const displayModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsModalOpen(true)
    }
    // Initialisation de la variable contenant les données du formulaire
    const initPasswordFormData = {
        email: ""
    }
    const [passwordData, setPasswordData] = useState(initPasswordFormData)

    // Soumission du formulaire de ré initialisation
    const reInitPasswordHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {  
        e.preventDefault();
        setIsModalOpen(false)
        setFlashMessage({status: true, message: "Votre demande de réinitialisation de mot de passe a bien été envoyée. Surveillez votre boîte mail..."})
        setTimeout(() => {setFlashMessage(null)}, 2000);
    }
         
    return (
        <>
            <main className={styles.loginBackground}>
                <Image 
                    className={styles.backgroundImage} 
                    src="/pictures/static/login.png" 
                    alt="affaires scolaires posées sur un bureau" 
                    fill 
                    priority/>
                <section className={styles.login}>
                    <Image 
                        className={styles.loginLogo} 
                        src="/pictures/static/logo-orange.svg" 
                        width={252} 
                        height={32} 
                        alt="Abricot"/>

                    {/* FORMULAIRE DE CONNEXION */}
                    <form 
                        className={styles.loginForm} 
                        onSubmit={handleSubmit}
                        noValidate
                        aria-describedby={ errors.length > 0 ? 'login-errors' : undefined }
                        >
                        <h1 
                            className={styles.formTitle}>Connexion</h1>
                        <section className={styles.formGroup}>
                            <label htmlFor="login-email">Email</label>
                            <input 
                                type="email" 
                                id="login-email"
                                name="email"
                                onChange={handleChange}
                                autoComplete="email"
                                required 
                                aria-invalid={ emailErrors.length > 0 } 
                                aria-describedby={ emailErrors.length > 0 ? 'login-email-error' : undefined }
                            />
                            {emailErrors.length > 0 && ( 
                                <p id="login-email-error" className={styles.fieldError} > {emailErrors[0].message} </p> 
                            )}
                        </section>

                        <section className={styles.formGroup}>
                            <label htmlFor="login-password">Mot de passe</label>
                            <input 
                                type="password" 
                                id="login-password"
                                name="password" 
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                                aria-invalid={ passwordErrors.length > 0 } 
                                aria-describedby={ passwordErrors.length > 0 ? 'login-password-error' : undefined }
                            />
                            {passwordErrors.length > 0 && ( 
                                <p id="login-password-error" className={styles.fieldError} > {passwordErrors[0].message} </p> 
                            )}
                        </section>
                        <button 
                            className={styles.btnSubmit} 
                            type="submit"
                            disabled={isSubmitting} 
                            aria-busy={isSubmitting}>{isSubmitting ? 'Connexion en cours…' : 'Se connecter'}
                        </button>
                        <button 
                            type="button" 
                            onClick={displayModal} 
                            className={styles.registerLink}>Mot de passe oublié ?</button>
                    </form>
                    <div className={styles.ctaRegister}>
                        <p>Pas encore de compte ? </p><Link className={styles.registerLink} href="/inscription">Créer un compte</Link>
                    </div>
                </section>
            </main>

            {/* MODALE DE RÉINITIALISATION */}
            {isModalOpen && (
                <Modal 
                    onClose={()=>setIsModalOpen(false)} 
                    titleId="reset-password-title">
                    <form onSubmit={reInitPasswordHandleSubmit} className={styles.reInitForm}>
                        <h2 id="reset-password-title">Demander la réinitialiation du mot de passe</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor='reset-email'>Indiquez à quelle adresse envoyer la procédure de ré initialisation</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="reset-email" 
                                onChange={(e) => setPasswordData({...passwordData, email: e.target.value})}
                                autoComplete="email"
                                required
                            >
                            </input>
                        </div>
                        <div className={styles.cta}>
                            <button type="submit">Envoyer</button>
                        </div>
                    </form>
                </Modal>
            )}

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
        </>
    )
}