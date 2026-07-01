'use client' 

import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
// TS imports
import { SubmitEvent } from 'react'
import { AuthenticateResult } from '../types/types'

export default function Login() {

    async function handleSubmit (event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        if(formData) {
            // Formatage nécessais car retour du get est soit string, soit file, soit null
            const email = formData.get('email')?.toString() ?? ''
            const password = formData.get('password')?.toString() ?? ''
            
            const response = await fetch('api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password}),
            })

            const data = await response.json()
            const token = data.data['token']
            
        
        }    
        
    }
    return (
        <>
            <div className={styles.loginBackground}>
                <Image className={styles.backgroundImage} src="/pictures/static/login.png" alt="affaires scolaires posées sur un bureau" fill priority/>
                <section className={styles.login}>
                    <img className={styles.loginLogo} src="/pictures/static/logo-orange.svg"/>
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <h1>Connexion</h1>
                        <section className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" required />
                        </section>
                        <section className={styles.formGroup}>
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" name="password" required />
                        </section>
                        <button type="submit">Se connecter</button>
                    </form>
                    <p>Pas encore de compte ? <Link className={styles.registerLink} href="#">Créer un compte</Link></p>
                </section>
            </div>
            
        </>
    )
}