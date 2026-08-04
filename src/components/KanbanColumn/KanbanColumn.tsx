import styles from './KanbanColumn.module.css'
import { Task } from '@/types/types'
import TaskStrip from '../TaskStrip/TaskStrip'

type KanbanColumnProps = {
    tasks: Task[];
    title: string;
    kanban: boolean;
}
export default function KanbanColumn({ tasks, title, kanban}: KanbanColumnProps) {
    return (
        <section className={styles.kanbanColumn}>
            <div className={styles.header}>
                <h2>{title}</h2>
                <span>{tasks.length}</span>
            </div>
            {tasks.map((task) => (
                <div key={task.id}><TaskStrip task={task} kanban={kanban}/></div>
            ))}
        </section>
    )
}