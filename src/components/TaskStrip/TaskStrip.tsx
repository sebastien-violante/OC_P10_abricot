import styles from './TaskStrip.module.css'
import { Task } from '@/types/types'
import TaskTags from '../TaskTag/TaskTag'
import TaskStatus from '../TaskStatus/TaskStatus'
import { useSelectedTask } from '@/store/SelectedTaskStore'

type TaskStripProps = {
    task: Task,
    kanban: boolean;
}

export default function TaskStrip({task, kanban}: TaskStripProps) {

    const setSelectedTask = useSelectedTask((state) => state.setTask)
    
    const handleClick =  () => {
        setSelectedTask(task)
    }

    const dueDate = new Date(task.dueDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', })
    const accessibleTaskDescription = `${task.title} décrite par ${task.description} et appartenant au projet ${task.project!.name} du ${dueDate} avec  ${task.comments!.length} commentaires`
    
    return (
        <article 
            className={styles.taskStrip}
            aria-labelledby={`task-title-${task.id}`}>
            <div className={styles.taskData}>
                <div className={styles.label}>
                    <h2 id={`task-title-${task.id}`}>{task.title}</h2>
                    <p className={styles.taskDescription}>{task.description}</p>
                </div>
                <div className={styles.tags}>
                    <TaskTags 
                        projectLabel={task.project!.name} 
                        dueDateLabel={dueDate}
                        assigneesLabel={task.comments!.length} />
                </div>
            </div>
            <div className={styles.taskActions}>
                <TaskStatus 
                    status={task.status} 
                    kanban={kanban} />
                <button 
                    className={`${styles.seeBtn} ${kanban ? styles.lower : ""}`} 
                    onClick={handleClick}
                    aria-label={`Voir les détails de la tâche ${accessibleTaskDescription}`} 
                    aria-haspopup="dialog"
                    >Voir
                </button>
            </div>
        </article>
    )
}