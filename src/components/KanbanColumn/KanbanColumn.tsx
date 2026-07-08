import styles from './KanbanColumn.module.css'
import { Task } from '@/types/types'
import TaskStrip from '../TaskStrip/TaskStrip'

type KanbanColumnProps = {
    tasks: Task[];
    title: string;
}
export default function KanbanColumn({ tasks, title }: KanbanColumnProps) {
    return (
        <section className={styles.kanbanColumn}>
            <h2>{title}</h2>
            {tasks.map((task) => (
                <div key={task.id}><TaskStrip task={task}/></div>
            ))}
        </section>
    )
}