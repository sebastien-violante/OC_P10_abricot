import { Task } from "@/types/types"

export default function isCurrentMonthTask(dueDate: Task['dueDate']) {
    const now = new Date()
    const date = new Date(dueDate)

    return (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear())
    
}