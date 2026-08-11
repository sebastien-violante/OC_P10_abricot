export default function getApiErrorMessage (status: number): string 
{
    switch (status) {
        case 400:
            return "La requête est invalide.";

        case 401:
            return "Votre session a expiré.";

        case 403:
            return "Vous n'avez pas les permissions nécessaires.";

        case 404:
            return "La ressource demandée n'existe pas.";

        case 409:
            return "Cette opération ne peut pas être effectuée.";

        case 500:
            return "Une erreur est survenue sur le serveur.";

        default:
            return "Une erreur inattendue est survenue.";
    }
};