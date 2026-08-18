import type { User } from "@/types/types"

/**
 * Renvoie deux caractères correspondants aux initiales du nom de l'utilisateur fourni
 * @param {string} name - valeur de la propriété name de l'utilisateur
 * @returns {string} - initiales de l'utilisateur
*/
export default function getInitials(name: User['name'] | undefined): string {
    
    if(!name) return ""
    
    const parts= name.split(' ')
    let initials = ""
    for( let index = 0; index < parts.length; index ++) {
        initials+=parts[index][0].toUpperCase()
    }
    return initials
       
}