import type { Token, ProjectResponse } from "@/types/types";

type fetchProjectsWithoutTasksProps = {
    token: Token;
}

export default async function fetchProjectsWithoutTasks({token}: fetchProjectsWithoutTasksProps) {
    
    const response = await fetch('/api/projects', {
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

    const data: ProjectResponse = await response.json()
    return data.data.projects
}