import type { Task } from "@/types/types"
import sortTasksByDate from "./sortTasksByDate";

type sortTasksByPriorityProps = {
    tasks: Task[];
}

export default function sortTasksByPriority({tasks}: sortTasksByPriorityProps) {
    console.log(tasks)
    const lowTasks:Task[]=[]
    const mediumTasks:Task[]=[]
    const highTasks:Task[]=[]

    tasks.forEach(task => {
        switch(task.priority) {
            case("LOW"):
                lowTasks.push(task)
                break
            case("MEDIUM"):
                mediumTasks.push(task)
                break
            case("HIGH"):
                highTasks.push(task)
                break
        }
    })

    sortTasksByDate(lowTasks)
    sortTasksByDate(mediumTasks)
    sortTasksByDate(highTasks)

    return [...highTasks,...mediumTasks,...lowTasks]
}