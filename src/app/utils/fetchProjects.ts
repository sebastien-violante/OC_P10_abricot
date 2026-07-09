import type { Token, ProjectResponse } from "@/types/types";

type fetchProjectsProps = {
    token: Token;
}

export default async function fetchProjects({token}: fetchProjectsProps) {
    
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
    console.log(data.data.projects)
    return data.data.projects
}