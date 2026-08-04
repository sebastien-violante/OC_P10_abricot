import styles from './TaskStatus.module.css'
import { Task } from '@/types/types'

type TaskStatusProps = {
    status: Task['status'];
    kanban?: boolean;
}
export default function TaskStatus({status, kanban}: TaskStatusProps) {
    
    const statusMap = {
    TODO: {
        className: styles.red,
        label: "À faire"
    },
    IN_PROGRESS: {
        className: styles.yellow,
        label: "En cours"
    },
    DONE: {
        className: styles.green,
        label: "Terminée"
    },
};

const { className, label } = statusMap[status] ?? statusMap['TODO'];
   
    return (
        <span className={`${styles.statusType} ${className} ${kanban ? styles.topRight : ""}`}>
            {label}
        </span>
    )   
}