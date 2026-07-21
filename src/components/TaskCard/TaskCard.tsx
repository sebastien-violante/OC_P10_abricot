import styles from './TaskCard.module.css'
import type { Task } from '@/types/types'

type TaskCardProps = {
    task: Task
}

export default function TaskCard({task}:TaskCardProps) {
    return (
        <section className={styles.taskCardWrapper}>
            {task.description}
        </section>
    )
}

