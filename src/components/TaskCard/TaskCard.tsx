'use client'

import styles from './TaskCard.module.css'
import type { Task } from '@/types/types'
import TaskStatus from '../TaskStatus/TaskStatus'
import { useState, useEffect } from 'react'
import { useTaskStore } from '@/store/TaskStore'
import { useCommentStore } from '@/store/CommentStore'
import deleteTask from '@/app/utils/deleteTask'
import { useProfile } from '@/app/context/profileContext'
import getInitials from '@/app/utils/getInitials'
import addComment from '@/app/utils/addComment'
import { useRouter } from "next/navigation"
import { formatDateWithHour } from '@/app/utils/formatDate'

type TaskCardProps = {
    task: Task;
    projectId: string;
    token?: string;
    editCurrentTask?: (task: Task) => void;
    ctaAvaliable: boolean;
}

export default function TaskCard({task, projectId, token, editCurrentTask, ctaAvaliable}:TaskCardProps) {
    
    const router = useRouter()
    
    // mise en store des commentaires
    const commentsInStore = useCommentStore((state) => state.comments)
    const setComments = useCommentStore((state) => state.setComments)
    const addTaskInStore = useCommentStore((state) => state.addComment)

    useEffect(() => {
        setComments(task.comments ?? [])
    }, [task.comments, setComments])
    const [displayComments, setDisplayComments] = useState(false)

    const [rotate, setRotate] = useState(false)
    const [cta, setCta] = useState(false)
    const { profile } = useProfile()
    const currentUserInitials = profile ? getInitials(profile.name) : ''

    const commentsId = `task-comments-${task.id}`
    const actionsId = `task-actions-${task.id}`
    const titleId = `task-title-${task.id}`

    function toggleComments() {
        setDisplayComments((prev) => !prev)
    }

    function toggleCta() {
        setCta((prev) => !prev)
    }
    
    async function editTask() {
       editCurrentTask?.(task)
       setCta(false)
    }

    async function removeTask() {
        if (!token) {
            router.replace("/")
            return
        }
        const taskId = task.id!

        const confirmed = window.confirm(
            "Vous êtes sur le point de supprimer cette tâche. Voulez-vous continuer ?"
        )
        if(!confirmed) return
        
        const response = await deleteTask({token, projectId, taskId})
        const fetchResult = await response.json()
        if(fetchResult.success) {
            useTaskStore.getState().removeTask(task.id!)
            setCta(false)
        }
        
    }

    async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const comment = formData.get("comment") as string
        if (!comment.trim()) return
        if (!token) {
            router.replace("/")
            return
        }
        const taskId = task.id!
        const payload = {content:comment}
        const response = await addComment({token, projectId, taskId, payload})
        const fetchResult = await response.json()
        if(fetchResult.success) {
            addTaskInStore(fetchResult.data.comment)
            form.reset()
        }
    }

    return (
        <article 
            className={styles.taskCardWrapper}
            aria-labelledby={titleId}>
            <header className={styles.taskCardTop}>
                <div className={styles.leftData}>
                    <div className={styles.taskCardHeader}>
                        <h2 
                            id={titleId}
                            className={styles.taskCardTitle}>
                                {task.title}
                        </h2> 
                        <TaskStatus status={task.status}/>
                    </div>
                    {task.description && (
                        <p className={styles.description}>
                            {task.description}
                        </p>
                    )}
                </div>
                {ctaAvaliable && (
                    <div className={styles.cta}>
                        <button 
                            type="button"
                            onClick={toggleCta}
                            aria-expanded={cta}
                            aria-controls={actionsId}
                            aria-label={`Actions pour la tâche ${task.title}`}
                            className={styles.ctaButton}
                        >
                         <img 
                            src="/pictures/static/taskCta.svg"
                            alt=""
                            aria-hidden="true"
                        />
                        </button>

                        {cta && (
                            <div 
                                className={styles.taskCtaProposals}
                                id={actionsId}
                            >
                                <ul className={styles.ul}>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={editTask} 
                                            className={styles.li}
                                        >
                                            <span>Modifier</span>
                                            <img 
                                                src="/pictures/static/pen.svg"
                                                alt=""
                                                aria-hidden="true"
                                            />
                                        </button> 
                                    </li>
                                    <li> 
                                        <button
                                            type="button"
                                            onClick={removeTask}
                                            className={styles.li}
                                        >
                                            <span>Supprimer</span>
                                            <img 
                                                src="/pictures/static/bin.svg"
                                                alt=""
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <section 
                className={styles.dueDate}
                aria-label="Échéance"
            >
                <span>Echéance:</span>
                <img 
                    className={styles.calendarPicture} 
                    src="/pictures/static/calendar.svg"
                    alt=""
                    aria-hidden="true"
                />
                <time 
                    className={styles.taskDueDate}
                    dateTime={task.dueDate}
                >
                    {new Date(task.dueDate!).toLocaleDateString("fr-FR", {day: "numeric",month: "long"})}
                </time>    
            </section>

            <section 
                className={styles.assignees}
            >
                <span>Assigné à :</span>

                <div className={styles.taskAssignees}>
                    {task.assignees?.map((assignee)=>(
                        <div 
                            className={styles.assignee}
                            key={assignee.id}
                        >
                            <span 
                                className={styles.initialBadge}
                                aria-hidden="true">{getInitials(assignee.user.name)}
                            </span>
                            <span 
                                className={styles.fullNameBadge}
                            >{assignee.user.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section 
                className={styles.comments}
            >
                <button
                    type="button" 
                    className={styles.commentsHeader}
                    onClick={toggleComments} 
                    aria-expanded={displayComments}
                    aria-controls={commentsId}
                >
                    <span className={styles.label}>
                        Commentaires ({commentsInStore ? commentsInStore.length : null})
                    </span>
                    <img 
                        src="/pictures/static/chevron.svg"
                        className={`${styles.showCommentsCta} ${!displayComments ? '' : styles.rotate }`}
                        alt=""
                        aria-hidden="true"/>
                </button>
                <div 
                    id={commentsId}
                    className={`${styles.commentsArea} ${displayComments ? styles.extended : ''}`}
                    hidden={!displayComments}
                >
                    {commentsInStore?.map((comment)=>(
                        <article 
                            key={comment.id} 
                            className={styles.commentStripe}
                        >
                            <div 
                                className={styles.initialBadge}
                                aria-hidden="true"
                            >
                                {getInitials(comment.author.name)}
                            </div>

                            <div className={styles.description}>
                                <div className={styles.leftSide}>
                                    <div className={styles.commentAuthor}>
                                        {comment.author.name}
                                    </div>
                                    <p className={styles.commentContent}>
                                        {comment.content}
                                    </p>
                                </div>
                                <time 
                                    className={styles.createdAt}
                                    dateTime={comment.createdAt}
                                >
                                    {formatDateWithHour(comment.createdAt)}
                                </time>
                            </div>
                        </article>
                    ))}
                    
                    {ctaAvaliable && (
                        <div className={styles.commentStripe}>
                            {profile && (
                                <div
                                    className={styles.initialCurrentUserBadge}
                                    aria-hidden="true"
                                >
                                    {currentUserInitials}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className={styles.formComment}
                            >
                                <div className={styles.description}>
                                    <label
                                        htmlFor={`comment-${task.id}`}
                                        className={styles.visuallyHidden}
                                    >
                                        Ajouter un commentaire
                                    </label>

                                    <input
                                        id={`comment-${task.id}`}
                                        type="text"
                                        name="comment"
                                        placeholder="Ajouter un commentaire..."
                                        autoComplete="off"
                                    />
                                </div>

                                <button
                                    className={styles.sendComment}
                                    type="submit"
                                >
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    )}
                </div>     
            </section>
        </article>
    )
}

