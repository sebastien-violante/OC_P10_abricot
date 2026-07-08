import styles from './Team.module.css'

export default function Team() {
    return (
        <article className={styles.teamWrapper}>
            <div className={styles.teamLabel}>
                <img src="pictures/static/union.svg"/>
                Equipe
                <span>({project.teamLength})</span>
            </div>
            <div className={styles.teamComposition}>
                <IdBadge id={project.owner}/>
                <span className={styles.Owner}>Propriétaire</span>
                {project.assignees.map.((assignee) => (
                    <IdBadge id={assignee}/>
                ))}
            </div>
        </article>
    )
}