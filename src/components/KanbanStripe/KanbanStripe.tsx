import styles from './KanbanStripe.module.css'
import { Task } from '@/types/types'

type KanbanStripeProps = {
    tasks: Task[];
}
export default function KanbanStripe({ tasks }: KanbanStripeProps) {
    return (
        <section className={styles.kanbanStripe}>
            {tasks.map((task) => (
                <p key={task.id}>{task.title}</p>
            ))}
        </section>
    )
}