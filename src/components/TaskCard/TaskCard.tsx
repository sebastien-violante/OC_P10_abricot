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
        setComments(task.comments)
    }, [task.comments, setComments])
    const [displayComments, setDisplayComments] = useState(false)
    const [rotate, setRotate] = useState(false)
    const [cta, setCta] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const { profile, setProfile } = useProfile()
    let currentUserInitials = ""
    if(profile) {
        currentUserInitials = getInitials(profile.name)
    }
    function showComments() {
       setDisplayComments((prev) => !prev)
       setRotate((prev) => !prev)
    }

    function ctaActions() {
        setCta((prev) => !prev)
    }

    async function editTask() {
       editCurrentTask?.(task)
    }

    async function removeTask() {
        if (!token) {
            router.replace("/")
            return
        }
        const taskId = task.id
        const confirmed = window.confirm(
            "Vous êtes sur le point de supprimer cette tâche. Voulez-vous continuer ?"
        )
        if (confirmed) {
            const response = await deleteTask({token, projectId, taskId})
            const fetchResult = await response.json()
            console.log(fetchResult)
            if(fetchResult.success) useTaskStore.getState().removeTask(task.id)
        }
        
    }

    async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const comment = formData.get("comment") as string
        console.log(comment)
        if (!token) {
            router.replace("/")
            return
        }
        const taskId = task.id
        const payload = {content:comment}
        const response = await addComment({token, projectId, taskId, payload})
        const fetchResult = await response.json()
        if(fetchResult.success) {
            addTaskInStore(fetchResult.data.comment)
            form.reset()
        }
    }

    return (
        <article className={styles.taskCardWrapper}>
            <section className={styles.taskCardTop}>
                <div className={styles.leftData}>
                    <div className={styles.taskCardHeader}>
                        <div className={styles.taskCardTitle}>{task.title}</div> 
                        <TaskStatus status={task.status}/>
                    </div>
                    <div className={styles.description}>
                        {task.description}
                    </div>
                </div>
                <div className={styles.cta}>
                    {ctaAvaliable && <button onClick={ctaActions}><img src="/pictures/static/taskCta.svg"/></button>}
                    {cta && <div className={styles.taskCtaProposals}>
                                <ul className={styles.ul}>
                                    <li onClick={editTask} className={styles.li}>
                                        <img src="/pictures/static/pen.svg"/>Modifier</li>
                                    <li onClick={removeTask} className={styles.li}>
                                        <img src="/pictures/static/bin.svg"/>Supprimer</li>
                                </ul>
                            </div>
                    }
                </div>
            </section>
            <section className={styles.dueDate}>
                Echéance: 
                <img className={styles.calendarPicture} src="/pictures/static/calendar.svg"/>
                <span className={styles.taskDueDate}>
                    {new Date(task.dueDate).toLocaleDateString("fr-FR", {day: "numeric",month: "long"})}
                </span>
                
            </section>
            <section className={styles.assignees}>
                Assigné à  : 
                <div className={styles.taskAssignees}>
                    {task.assignees.map((assignee)=>(
                        <div className={styles.assignee} key={assignee.id}>
                            <span className={styles.initialBadge} >{getInitials(assignee.user.name)}</span>
                            <span className={styles.fullNameBadge} >{assignee.user.name}</span>
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.comments}>
                <div onClick={showComments} className={styles.commentsHeader}>
                    <div className={styles.label}>
                        Commentaires ({commentsInStore.length})
                    </div>
                    <button onClick={showComments} className={`${styles.showCommentsCta} ${!displayComments ? '' : styles.rotate }`}><img src="/pictures/static/chevron.svg"/></button>
                </div>
                <section className={`${styles.commentsArea} ${displayComments ? styles.extended : ''}`}>
                    {commentsInStore.map((comment)=>(
                        <div key={comment.id} className={styles.commentStripe}>
                            <div className={styles.initialBadge}>{getInitials(comment.author.name)}</div>
                            <div className={styles.description}>
                                <div className={styles.leftSide}>
                                    <div className={styles.commentAuthor}>
                                        {comment.author.name}
                                    </div>
                                    <div className={styles.commentContent}>
                                        {comment.content}
                                    </div>
                                </div>
                                <div className={styles.createdAt}>
                                    {formatDateWithHour(comment.createdAt)}
                                </div>
                                
                            </div>
                        </div>
                    ))}
                    
                    <div className={styles.commentStripe}>
                        <div className={styles.initialCurrentUserBadge}>{currentUserInitials}</div>
                        <form onSubmit={handleSubmit} className={styles.formComment}>
                            <div className={styles.description}>
                                <input 
                                    type="text" 
                                    name="comment"
                                    placeholder='Ajouter un commentaire...'
                                ></input>
                            </div>
                            <button className={styles.sendComment} type="submit">Envoyer</button>
                        </form>
                    </div>
                    
                </section>
                
            </section>
        </article>
    )
}

