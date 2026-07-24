import styles from './ProgressBar.module.css'
import type { Project } from '@/types/types'


type ProgressBarProps = {
    project: Project;
}

export default function ProgressBar({project}: ProgressBarProps) {
    
    const isTasks = (project.tasks.length > 0)
    const doneTasks = project.tasks.filter(task => task.status === "DONE").length
    const totalTasks = project.tasks.length
    const percent = totalTasks > 0 ? Math.floor(doneTasks/totalTasks*100) : 0

    return (
        <>
            {isTasks &&
                <section className={styles.progressBar}>
                    <div className="flex justify-between">
                        <span className={styles.label}>Progression</span>
                        <span className={styles.label}>{percent}%</span>
                    </div>
                    <div 
                        className="w-full rounded-full h-2"
                        style={{background: "var(--grey200)"}}
                    >
                        <div 
                            className="bg-blue h-2 rounded-full transition-all duration-300" 
                            style={{width: `${percent}%`, background: "var(--grey400)"}}>
                        </div>
                    </div>
                    <p className={styles.counters}>{doneTasks}/{totalTasks} tâches terminées</p>
                </section>
            }
        </>
    )
}