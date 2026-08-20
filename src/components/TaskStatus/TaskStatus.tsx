import styles from './TaskStatus.module.css'
import { Task } from '@/types/types'

type TaskStatusProps = {
    status: Task['status'];
    mode: string;
}
export default function TaskStatus({status, mode}: TaskStatusProps) {
    
    const statusMap = {
    TODO: {className: styles.red, label: "À faire"},
    IN_PROGRESS: {className: styles.yellow, label: "En cours"},
    DONE: {className: styles.green, label: "Terminée"},
    } as const

    const { className, label } = statusMap[status!] ?? statusMap['TODO'];

    return (
        <span className={`${styles.statusType} ${className} ${styles[mode]}`}>
            {label}
        </span>
    )   
}