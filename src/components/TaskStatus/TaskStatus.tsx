import styles from './TaskStatus.module.css'
import { Task } from '@/types/types'

type TaskStatusProps = {
    status: Task['status']
}
export default function TaskStatus({status}: TaskStatusProps) {
    
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

const { className, label } = statusMap[status];
   
    return (
        <span className={`${styles.statusType} ${className}`}>
            {label}
        </span>
    )   
}