import styles from './TaskStrip.module.css'
import { Task } from '@/types/types'
import TaskTags from '../TaskTag/TaskTag'
import TaskStatus from '../TaskStatus/TaskStatus'
import { useSelectedTask } from '@/store/SelectedTaskStore'

type TaskStripProps = {
    task: Task,
    mode: string;
}

export default function TaskStrip({task, mode}: TaskStripProps) {

    const setSelectedTask = useSelectedTask((state) => state.setTask)
    
    const handleClick =  () => {
        setSelectedTask(task)
    }

    const dueDate = new Date(task.dueDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', })
    
    return (
        <article 
            className={styles.taskStrip}
            aria-labelledby={`task-title-${task.id}`}>
            <TaskStatus 
            status={task.status} 
            mode={mode} />
            <div className={styles.taskData}>
                <div className={styles.label}>
                    <h2 className={`${styles[mode]}`} id={`task-title-${task.id}`}>{task.title}</h2>
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
                
                <button 
                    type="button"
                    className={styles.seeBtn} 
                    onClick={handleClick}
                    aria-label={`Voir les détails de la tâche ${task.title}`} 
                    aria-haspopup="dialog"
                    >Voir
                </button>
            </div>
        </article>
    )
}