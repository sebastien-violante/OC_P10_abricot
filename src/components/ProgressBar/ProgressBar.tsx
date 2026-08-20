import styles from './ProgressBar.module.css'
import type { Project } from '@/types/types'

type ProgressBarProps = {
    project: Project
}

export default function ProgressBar({ project }: ProgressBarProps) {
    const tasks = project.tasks ?? []
    const doneTasks = tasks.filter(
        (task) => task.status === 'DONE'
    ).length
    const totalTasks = tasks.length
    const percent =
        totalTasks > 0
            ? Math.floor((doneTasks / totalTasks) * 100)
            : 0

    if (totalTasks === 0) {
        return null
    }

    return (
        <section className={styles.progressBar}>
            <div className="flex justify-between">
                <span className={styles.label}>
                    Progression
                </span>
                <span className={styles.label}>
                    {percent}%
                </span>
            </div>
            <div
                className="w-full rounded-full h-2"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progression du projet : ${percent}%`}
                style={{
                    background: 'var(--grey200)',
                }}
            >
                <div
                    className="bg-blue h-2 rounded-full transition-all duration-300"
                    style={{
                        width: `${percent}%`,
                        background: 'var(--grey400)',
                    }}
                />
                </div>
                <p className={styles.counters}>
                    {doneTasks}/{totalTasks} tâches terminées
                </p>
        </section>
    )
}