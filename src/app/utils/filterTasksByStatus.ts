import type { Task } from "@/types/types"


export default function filterTasksByStatus(tasks: Task[]) {
    const result = {
        todoTasks: [] as Task[],
        inProgressTasks: [] as Task[],
        doneTasks: [] as Task[],
    };

    for (const task of tasks) {
        switch (task.status) {
            case "TODO":
                result.todoTasks.push(task);
                break;

            case "IN_PROGRESS":
                result.inProgressTasks.push(task);
                break;

            case "DONE":
                result.doneTasks.push(task);
                break;
        }
    }

    result.todoTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    result.inProgressTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    result.doneTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return result;
}