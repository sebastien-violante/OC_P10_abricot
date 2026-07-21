import type { Token, SingleProjectResponse } from "@/types/types";

type FetchProjectProps = {
    id: string;
    token: Token;
}

export default async function fetchProject({id, token}: FetchProjectProps) {
    
    
    console.log(`/api/projects/${id}/tasks`)
    const response = await fetch(`/api/projects/${id}/tasks`, {
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
    
        const data: SingleProjectResponse = await response.json()
        return (data.data.tasks)
    }