import styles from './TaskTag.module.css'

type TaskTagProps = {
    projectLabel: string;
    dueDateLabel: string;
    assigneesLabel: number;
}
export default function TaskTags({projectLabel, dueDateLabel, assigneesLabel}: TaskTagProps) {
    return(
        <div className={styles.taskTag}>
            <div className={styles.project}>
                <img
                    className={styles.icon}
                    src="pictures/static/folder.svg"
                    alt=""/>
                <span>{projectLabel}</span>
            </div>
            <div className={styles.calendar}>
                <img 
                    className={styles.icon}
                    src="pictures/static/calendar.svg"
                    alt=""/>
                <span>{dueDateLabel}</span>
            </div>
            <div className={styles.message}>
                <img 
                    className={styles.icon}
                    src="pictures/static/message.svg"
                    alt=""/>
                <span>{assigneesLabel}</span>
            </div>
        </div>
    )
    
}