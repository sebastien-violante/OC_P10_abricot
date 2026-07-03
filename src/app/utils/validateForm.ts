import type { FormData, FormErrors } from "@/types/types"

/**
 * Renvoie les erreurs sur les champs de formulaire
 * @param {Object} formData - les données récoltées dans les champs du formulaire
 * @returns {Object} errors - les erreurs
 */

export default function validateForm(formData: FormData): FormErrors {
    
    const errors: FormErrors = {}

    const validateName = (name: string) => {
        return /^[a-zA-Z0-9]+$/.test(name)
    }

    if(!formData.email.trim()) {
        errors.email = "Le champ email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
        errors.email = "Le format du mail est invalide"
    }
    if(formData.password.trim().length < 8) {
        errors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }
    if(formData.type) {
        console.log(formData.type)
        if(!formData.name || formData.name.trim().length < 2) {
            errors.name = "Le pseudo doit avoir au moins 2 caractères"
        } else if (!validateName(formData.name)) {
            console.log(validateName(formData.name))
            errors.name = "Le pseudo ne doit comprendre que des caractères alphanumériques"
        }
    }

    return errors
}