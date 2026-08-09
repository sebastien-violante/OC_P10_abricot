import { Token } from "@/types/types";

type ApiErrorDetail = { 
    field: string; 
    message: string; 
} 

export type ApiResponse<T = unknown> = { 
    success: boolean; 
    message: string; 
    data?: T; 
    error?: string; 
    details?: ApiErrorDetail[]; 
};

type DeleteRequestProps<T> = {
    url: string;
    token?: Token;
    payload?: T;
};

/**
 * Effectue une requête en DELETE à l'API qui supprime les données demandées
 * @param {string} url - endPoint de l'API
 * @param {string} token - token d'authentification fourni par l'API
 * @param {Object} payload - élements du body demandés par la requête
 * @returns {Object} - result - données renvoyées par l'API
 */
export default async function deleteRequest<T>({
    url,
    token,
    payload
}: DeleteRequestProps<T>): Promise<ApiResponse> {

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "DELETE",
        headers,
        body: JSON.stringify(payload),
    });

    let result: ApiResponse

    try { 
        result = await response.json(); 
    } catch { 
        throw { 
            status: response.status, 
            message: "Réponse invalide du serveur.", 
        }
    }
    
    if (!response.ok) { 
        throw { 
            status: response.status, 
            message: result.message || "Une erreur serveur est survenue.", 
            error: result.error, 
            details: result.details, 
        } 
    }

    return result;
}