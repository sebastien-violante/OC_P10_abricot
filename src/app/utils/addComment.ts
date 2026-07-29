import type { User } from "@/types/types"

type addCommentProps = {
    token: string;
    projectId: string;
    taskId: string;
    payload: {
        content: string;
    }
    
}
export default async function addComment({token, projectId, taskId, payload}: addCommentProps) {
    
    const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
    })
    return response
}