'use client' 

import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import validateForm from './utils/validateForm'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitEvent, ChangeEvent } from 'react'
import Cookies from "js-cookie"
import { AuthenticateResult, FormData, FormErrors, FetchErrors, FetchSuccessData } from '../types/types'

export default function Login() {

    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({})

    const [fetchErrors, setFetchErrors] = useState<FetchErrors>("")

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target 
        setFormData((prev) => ({...prev, [name]: value}))
    }
    
    async function handleSubmit (event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const errors = validateForm(formData)
        setFormErrors(errors)
        
        if(!errors.email && !errors.password) {
            const email = formData.email
            const password = formData.password
            
            try {

                const response = await fetch('api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({email, password}),
                })

                if(!response.ok) {
                    let errorData: FetchErrors = "";
                    try {
                        errorData = await response.json();
                    } catch {
                        throw new Error("Erreur serveur ou réponse invalide");
                    }   

                    switch (response.status) {
                        case 400:
                            throw new Error("Données invalides");
                        case 401:
                            throw new Error("Email ou mot de passe incorrect");
                        case 403:
                            throw new Error("Accès interdit");
                        case 404:
                            throw new Error("Endpoint introuvable");
                        case 500:
                        default:
                            throw new Error("Erreur serveur, veuillez réessayer");
                    }
                }

                const data: FetchSuccessData = await response.json();
                if (!data.data.token) {
                    throw new Error("Token manquant dans la réponse");
                } else {
                    console.log(data.data.token)
                    Cookies.set('token', data.data.token, {
                        expires: 1 / 24,
                        secure: true,
                        sameSite: 'strict',
                        });
                    router.push('/dashboard')
                }
                
                
                

            } catch(error) {

                if (error instanceof Error) {
                    setFetchErrors(error.message)
                throw error;
                }

            throw new Error("Erreur inconnue");
            }
        }    
        
    }
    return (
        <>
            <div className={styles.loginBackground}>
                <Image className={styles.backgroundImage} src="/pictures/static/login.png" alt="affaires scolaires posées sur un bureau" fill priority/>
                <section className={styles.login}>
                    <img className={styles.loginLogo} src="/pictures/static/logo-orange.svg"/>
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <h1 className={styles.formTitle}>Connexion</h1>
                        {fetchErrors && (<span id="firstname-error" role="alert">{fetchErrors}</span>)}

                        <section className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                name="email"
                                onChange={handleChange}
                                //required 
                            />
                            {formErrors.email && (<span id="firstname-error" role="alert">{formErrors.email}</span>)}
                        </section>
                        <section className={styles.formGroup}>
                            <label htmlFor="password">Mot de passe</label>
                            <input 
                                type="password" 
                                name="password" 
                                onChange={handleChange}
                                required 
                            />
                            {formErrors.password && (<span id="firstname-error" role="alert">{formErrors.password}</span>)}

                        </section>
                        <button className={styles.btnSubmit} type="submit">Se connecter</button>
                        <Link className={styles.registerLink} href="#">Mot de passe oublié ?</Link>
                    </form>
                    <p>Pas encore de compte ? <Link className={styles.registerLink} href="#">Créer un compte</Link></p>
                </section>
            </div>
            
        </>
    )
}