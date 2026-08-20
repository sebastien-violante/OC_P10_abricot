import styles from './TaskTag.module.css'

type TaskTagProps = {
    projectLabel: string;
    dueDateLabel: string;
    assigneesLabel: number;
}
export default function TaskTags({projectLabel, dueDateLabel, assigneesLabel}: TaskTagProps) {
    return(
        <ul className={styles.taskTag}>
            <li className={styles.project}>
                <img className={styles.icon} src="pictures/static/folder.svg" alt="" aria-hidden="true"/>
                <span>{projectLabel}</span>
            </li>
            <li className={styles.calendar}>
                <img className={styles.icon} src="pictures/static/calendar.svg" alt="" aria-hidden="true"/>
                <span>{dueDateLabel}</span>
            </li>
            <li className={styles.message} aria-label={`${assigneesLabel} ${assigneesLabel > 1 ? 'collaborateurs' : 'collaborateur'}`}>
                <img className={styles.icon} src="pictures/static/message.svg" alt="" aria-hidden="true"/>
                <span>{assigneesLabel}</span>
            </li>
        </ul>
    )
    
}