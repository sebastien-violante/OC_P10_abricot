'use client'

import styles from './TaskCard.module.css'
import type { Task } from '@/types/types'
import TaskStatus from '../TaskStatus/TaskStatus'
import { useState } from 'react'

type TaskCardProps = {
    task: Task
}

export default function TaskCard({task}:TaskCardProps) {

    const [comments, setComments] = useState(false)
    const [rotate, setRotate] = useState(false)
    function showComments() {
       setComments((prev) => !prev)
       setRotate((prev) => !prev)
    }
    return (
        <article className={styles.taskCardWrapper}>
            <section className={styles.taskCardTitle}>
                {task.title} <TaskStatus status={task.status}/>
                {task.description}
            </section>
            <section>
                Echéance: {new Date(task.dueDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                })}
            </section>
            <section className={styles.assignees}>
                Assigné à  : 
                <div className={styles.taskAssignees}>
                    {task.assignees.map((assignee)=>(
                        <p key={assignee.id}>{assignee.user.name}</p>
                    ))}
                </div>
            </section>
            <section className={styles.comments}>
                <div className={styles.commentsHeader}>
                    <div className={styles.label}>
                        Commentaires ({task.comments.length})
                    </div>
                    <button onClick={showComments} className={`${styles.showCommentsCta} ${!comments ? '' : styles.rotate }`}><img src="/pictures/static/chevron.svg"/></button>
                </div>
                <section className={`${styles.commentsArea} ${comments ? styles.extended : ''}`}>
                    {task.comments.map((comment)=>(
                        <div key={comment.id} className={styles.commentStripe}>
                            <div className={styles.idTag}>BD</div>
                            <div className={styles.description}>description</div>
                        </div>
                    ))}
                    
                    <div className={styles.commentStripe}>
                        <div className={styles.idTag}>BD</div>
                        <form>
                            <div className={styles.description}>
                                <input type="text" name="comment"></input>
                            </div>
                            <button type="submit">Envoyer</button>
                        </form>
                    </div>
                    
                </section>
                
            </section>
        </article>
    )
}

