import styles from './TaskStrip.module.css'
import { Task } from '@/types/types'
import TaskTags from '../TaskTag/TaskTag'
import TaskStatus from '../TaskStatus/TaskStatus'
import Button from '../Button/Button'
import { useSelectedTask } from '@/store/SelectedTaskStore'

type TaskStripProps = {
    task: Task,
    kanban: boolean;
}

export default function TaskStrip({task, kanban}: TaskStripProps) {

    const setSelectedTask = useSelectedTask((state) => state.setTask)
    function handleClick () {
        setSelectedTask(task)
    }

    return (
        <article className={styles.taskStrip}>
            <div className={styles.taskData}>
                <div className={styles.label}>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                </div>
                <div className={styles.tags}>
                    <TaskTags 
                        projectLabel={task.project.name} 
                        dueDateLabel={
                            new Date(task.dueDate).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                            })
                        }
                        assigneesLabel={task.comments.length} />
                </div>
            </div>
            <div className={styles.taskActions}>
                <TaskStatus status={task.status} kanban={kanban} />
                <button className={`${styles.seeBtn} ${kanban ? styles.lower : ""}`} onClick={handleClick}>Voir</button>
            </div>
        </article>
    )
}