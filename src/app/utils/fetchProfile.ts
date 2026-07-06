import type { Token } from "@/types/types";

type fetchProfileProps = {
    token: Token;
}

export default async function fetchProfile({token}: fetchProfileProps) {
    
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
    
    const data = await response.json()
    return data.data.user
}