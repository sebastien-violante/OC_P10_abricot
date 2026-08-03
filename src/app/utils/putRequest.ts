import { Token } from "@/types/types"

type putRequestProps<T> = {
    url: string;
    token: Token;
    payload: T
}

export default async function putRequest<T>({url, token, payload}: putRequestProps<T>) {
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
    })
    return response
}