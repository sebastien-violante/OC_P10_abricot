import type { User } from "@/types/types"

type recordProjectProps = {
    payload: {
        name: string;
        description: string;
        contributors: string[];
    };
    token: string;
}
export default async function recordProject({payload, token}: recordProjectProps) {
    console.log(JSON.stringify(payload))
    console.log(token)
    const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
    })
    return response
}