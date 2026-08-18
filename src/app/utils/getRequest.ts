import { Token } from "@/types/types";

type ApiErrorDetail = {
    field: string;
    message: string;
};

export type ApiResponse<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    details?: ApiErrorDetail[];
};

type GetRequestProps = {
    url: string;
    token?: Token;
};

/**
 * Effectue une requête en GET à l'API qui renvoie les données demandées
 * @param {string} url - endpoint de l'API
 * @param {string} token - token d'authentification fourni par l'API
 * @returns {Object} - données renvoyées par l'API
 */
export default async function getRequest<TResponse = unknown>({
    url,
    token,
}: GetRequestProps): Promise<ApiResponse<TResponse>> {

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
    });

    let result: ApiResponse<TResponse>;

    try {
        result = await response.json();
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
        };
    }

    return result;
}