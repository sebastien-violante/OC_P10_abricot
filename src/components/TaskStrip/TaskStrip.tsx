import styles from './TaskStrip.module.css'
import { Task } from '@/types/types'
import TaskTags from '../TaskTag/TaskTag'
import TaskStatus from '../TaskStatus/TaskStatus'
import Button from '../Button/Button'
import { useSelectedTask } from '@/store/SelectedTaskStore'

type TaskStripProps = {
    task: Task
}

export default function TaskStrip({task}: TaskStripProps) {

    const setSelectedTask = useSelectedTask((state) => state.setTask)
    function handleClick () {
        setSelectedTask(task)
    }

    return (
        <article className={styles.taskStrip}>
            <div className={styles.taskData}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <div className={styles.tags}>
                    {task.status}
                    <TaskTags 
                        projectLabel={task.project.name} 
                        dueDateLabel={
                            new Date(task.dueDate).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                            })
                        }
                        assigneesLabel={task.assignees.length} />
                </div>
            </div>
            <div className={styles.taskActions}>
                <TaskStatus status={task.status} />
                <Button color={"black"} width={"medium"} onClick={handleClick}>Voir</Button>
            </div>
        </article>
    )
}