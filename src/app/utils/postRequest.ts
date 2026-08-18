import { Token } from "@/types/types";
import type { ApiResponse } from "@/types/types";

type PostRequestProps<T> = {
    url: string;
    token?: Token;
    payload: T;
};

/**
 * Effectue une requête en POST à l'API qui renvoie les données demandées
 * @param {string} url - endPoint de l'API
 * @param {string} token - token d'authentification fourni par l'API
 * @param {Object} payload - élements du body demandés par la requête
 * @returns {Object} - result - données renvoyées par l'API
 */
export default async function postRequest<TPayload, TResponse = unknown>({
    url,
    token,
    payload
}: PostRequestProps<TPayload>): Promise<ApiResponse<TResponse>> {

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    let result: ApiResponse<TResponse>

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