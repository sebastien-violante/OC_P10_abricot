import type { Token, ProjectResponse } from "@/types/types";

type fetchProjectsWithTasksProps = {
    token: Token;
}

export default async function fetchProjectsWithTasks({token}: fetchProjectsWithTasksProps) {
    
    const response = await fetch('/api/dashboard/projects-with-tasks', {
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