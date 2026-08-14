import { Task } from "@/types/types"

export default function isTaskDueWithinOneMonth(dueDate: Task["dueDate"]) {
    if (!dueDate) return false

    const now = new Date()
    const date = new Date(dueDate)

    const oneMonthFromNow = new Date(now)
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    return date >= now && date <= oneMonthFromNow
}