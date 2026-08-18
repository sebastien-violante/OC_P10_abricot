import { Task } from "@/types/types"

/**
 * Renvoie une date si elle est comprise entre la date du jour et la date du jour + 1 mois
 * @param {string} dueDate - date au format chaine de caractère ISO
 * @returns {string} - date
*/
export default function isTaskDueWithinOneMonth(dueDate: Task["dueDate"]) {
    if (!dueDate) return false

    // transformation de dueDate en Date
    const date = new Date(dueDate)

    // création de la date de jour + 1 mois
    const now = new Date()
    const oneMonthFromNow = new Date(now)
    oneMonthFromNow.setMonth(new Date(now).getMonth() + 1)

    // Comparaison et renvoi 
    return date >= now && date <= oneMonthFromNow
}