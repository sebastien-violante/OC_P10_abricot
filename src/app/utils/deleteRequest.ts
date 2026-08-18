import { Token } from "@/types/types";
import type { ApiResponse } from "@/types/types";

type DeleteRequestProps<T> = {
    url: string;
    token?: Token;
    payload?: T;
};

/**
 * Effectue une requête en DELETE à l'API
 * @param {string} url - endpoint de l'API
 * @param {string} token - token d'authentification
 * @param {Object} payload - éléments du body demandés par la requête
 * @returns {Object} - données renvoyées par l'API
 */
export default async function deleteRequest<TPayload, TResponse = unknown>({
    url,
    token,
    payload
}: DeleteRequestProps<TPayload>): Promise<ApiResponse<TResponse>> {

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

    let result: ApiResponse<TResponse>

    try {
        result = await response.json();
    } catch {
        throw new Error("Réponse invalide du serveur.")
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
