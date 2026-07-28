import type { User } from "@/types/types"

type editTaskProps = {
    payload: {
        title: string;
        description: string;
        assigneeIds: string[];
        dueDate: string;
        status: string;
    };
    token: string;
    projectId: string;
    taskId: string
}
export default async function editTask({payload, token, projectId, taskId}: editTaskProps) {
    
    const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
    })
    return response
}