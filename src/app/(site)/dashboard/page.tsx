'use client'

import Cookies from "js-cookie"
import styles from './page.module.css'
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/types";

export default function Dashboard() {
    
    // Récupération du token dans les cookies
    const router = useRouter()
    const token = Cookies.get('token');
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect (() => {
        if(!token) router.push('/')
     }, [token, router])


    // Récupération des informations de profil
    useEffect(() => {
        async function fetchProfil(token: string) {
            try {
                const response = await fetch('/api/auth/profile', {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    }
                })
                if(!response.ok) {
                    switch (response.status) {
                        case 401:
                            throw new Error("echec de l'authentification");
                        default:
                            throw new Error("Erreur serveur, veuillez réessayer");
                    }
                }
                const data = await response.json();
                setUserData(data.data.user)
                localStorage.setItem("user", JSON.stringify(data.user));
            } catch(error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if(token) fetchProfil(token)
    }, [token])
    
      
    const title="Tableau de bord"
    const subtitle=`Bonjour ${userData?.name}, voici un aperçu de vors projets et tâches`
    const handleClick = () => {
        console.log('cliqué')
    }

    if (loading) {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
        </div>
    );
}
    return (
        <div className={styles.sectionWrapper}>
            <Banner title={title} subtitle={subtitle}>
                <Button type={"black"} width={"xlarge"} onClick={handleClick}>+ Créer un projet</Button>
            </Banner>
        </div>
        
    )
}