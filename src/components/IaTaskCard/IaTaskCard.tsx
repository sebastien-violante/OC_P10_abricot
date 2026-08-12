import { TaskIa } from '@/types/types'
import styles from './IaTaskCard.module.css'

type IaTaskCardProps = {
    task: TaskIa;
}
export default function IaTaskCard({task}: IaTaskCardProps) {
    return (
        <div className={styles.iaCardContainer}>
            <section className={styles.header}>
                <h3>{task.titre}</h3>
                <p>{task.description}</p>
            </section>
            <section className={styles.cta}>
                <button className={styles.ctaButton}>
                    <img alt="" src="/pictures/static/bin.svg" aria-hidden="true"/>
                    <span>Supprimer</span>
                </button>
                <button className={styles.ctaButton}>
                    <img alt="" src="/pictures/static/pen.svg" aria-hidden="true"/>
                    <span>Modifier</span>
                </button>
            </section>
        </div>
    )
}