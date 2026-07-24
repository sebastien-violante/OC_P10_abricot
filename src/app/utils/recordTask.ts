import type { User } from "@/types/types"

type recordTaskProps = {
    payload: {
        title: string;
        description: string;
        assigneeIds: string[];
        dueDate: string;
        status: string;
    };
    token: string;
    projectId: string;
}
export default async function recordTask({payload, token, projectId}: recordTaskProps) {
    
    const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
    })
    return response
}