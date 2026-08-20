import styles from './KanbanColumn.module.css'
import { Task } from '@/types/types'
import TaskStrip from '../TaskStrip/TaskStrip'

type KanbanColumnProps = {
    tasks: Task[];
    title: string;
    mode: string;
}
export default function KanbanColumn({ tasks, title, mode}: KanbanColumnProps) {
    
    const headingId = `kanban-column-${title.toLowerCase() .replace(/\s+/g, '-')}`

    return (
        <section 
            className={styles.kanbanColumn}
            aria-labelledby={headingId}
            tabIndex={0}>
            <div className={styles.header}>
                <h2 id={headingId}>{title}</h2>
                <span aria-label={`${tasks.length} tâche${tasks.length > 1 ? 's' : ''}`}>{tasks.length}</span>
            </div>
            <div>
                {tasks.map((task) => (
                    <li key={task.id} className={styles.taskList}>
                        <TaskStrip task={task} mode={mode} />
                    </li>
                ))}
            </div>
        </section>
    )
}