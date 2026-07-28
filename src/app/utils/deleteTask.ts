import type { User } from "@/types/types"

type deleteTaskProps = {
    token: string;
    projectId: string;
    taskId: string;
}
export default async function deleteTask({token, projectId, taskId}: deleteTaskProps) {
    
    const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        }
    })
    return response
}