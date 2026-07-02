import type { FormData, FormErrors } from "@/types/types"

/**
 * Renvoie les erreurs sur les champs de formulaire
 * @param {Object} formData - les données récoltées dans les champs du formulaire
 * @returns {Object} errors - les erreurs
 */

export default function validateForm(formData: FormData): FormErrors {
    
    const errors: FormErrors = {}
    if(!formData.email.trim()) {
        errors.email = "Le champ email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
        errors.email = "Le format du mail est invalide"
    }
    if(formData.password.length < 8) {
        errors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    return errors
}