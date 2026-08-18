import type { Task } from "@/types/types"

/**
 * Trie les tâches fournies par date d'échéance croissante
 * @param {Object} tasks - tâches non triées
 * @returns {Object} - tâches triées
*/
export default function sortTasksByDate(tasks: Task[]) {
    return (
        tasks.filter(task => task.status === "TODO" || task.status === "IN_PROGRESS").
        sort((a,b) => 
            new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
        )
    )
}