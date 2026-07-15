import type { Token, UserResponse } from "@/types/types";

type fetchUserProps = {
    token: Token;
    value: string;
}

export default async function fetchUsers({token, value}: fetchUserProps) {
    
    const response = await fetch(`/api/users/search?query=${value}`, {
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
    
        const data: UserResponse = await response.json()
        return data.data.users
}