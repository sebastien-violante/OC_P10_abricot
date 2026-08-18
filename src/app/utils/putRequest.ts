import { Token } from "@/types/types";
import type { ApiResponse } from "@/types/types";

type PutRequestProps<T> = {
    url: string;
    token?: Token;
    payload: T;
}

/**
 * Effectue une requête en PUT à l'API
 * @param {string} url - endpoint de l'API
 * @param {string} token - token d'authentification
 * @param {Object} payload - éléments du body demandés par la requête
 * @returns {Object} - données renvoyées par l'API
 */
export default async function putRequest<TPayload, TResponse = unknown>({
    url,
    token,
    payload
}: PutRequestProps<TPayload>): Promise<ApiResponse<TResponse>> {

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
    })

    let result: ApiResponse<TResponse>

    try {
        result = await response.json()
    } catch {
        throw {
            status: response.status,
            message: "Réponse invalide du serveur.",
        };
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