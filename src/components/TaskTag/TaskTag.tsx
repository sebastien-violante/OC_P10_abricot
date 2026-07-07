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
                <img src="pictures/static/folder.svg"/>
                {projectLabel}
            </div>
            <div className={styles.calendar}>
                <img src="pictures/static/calendar.svg"/>
                {dueDateLabel}
            </div>
            <div className={styles.message}>
                <img src="pictures/static/message.svg"/>
                {assigneesLabel}
            </div>
        </div>
    )
    
}