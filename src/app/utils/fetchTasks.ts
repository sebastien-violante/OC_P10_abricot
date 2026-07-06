import type { Token, TasksResponse } from "@/types/types";

type fetchTasksProps = {
    token: Token;
}

export default async function fetchTasks({token}: fetchTasksProps) {
    
    const response = await fetch('/api/dashboard/assigned-tasks', {
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

    const data: TasksResponse = await response.json()
    return data.data.tasks
}