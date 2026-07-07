import type { Task } from "@/types/types"


export default function filterTasksByDate(tasks: Task[]) {
       
    return (
        tasks.filter(task => task.status === "TODO" || task.status === "IN_PROGRESS").
        sort((a,b) => 
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
    )
}