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

type TaskCardProps = {
    task: Task;
    projectId: string;
    token?: string;
    editCurrentTask: (task: Task) => void;
}

export default function TaskCard({task, projectId, token, editCurrentTask}:TaskCardProps) {

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
       editCurrentTask(task)
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
            <section className={styles.taskCardTitle}>
                {task.title} <TaskStatus status={task.status}/>
                {task.description}
                <button onClick={ctaActions}><img src="/pictures/static/taskCta.svg"/></button>
                {cta && <div className={styles.taskCtaProposals}>
                    <ul>
                        <li onClick={editTask}>Modifier</li>
                        <li onClick={removeTask}>Supprimer</li>
                    </ul>
                </div>}
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
                    <button onClick={showComments} className={`${styles.showCommentsCta} ${!displayComments ? '' : styles.rotate }`}><img src="/pictures/static/chevron.svg"/></button>
                </div>
                <section className={`${styles.commentsArea} ${displayComments ? styles.extended : ''}`}>
                    {commentsInStore.map((comment)=>(
                        <div key={comment.id} className={styles.commentStripe}>
                            <div className={styles.idTag}>{getInitials(comment.author.name)}</div>
                            <div className={styles.description}>
                                <div className={styles.commentAuthor}>
                                    {comment.author.name}
                                </div>
                                <div className={styles.commentContent}>
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className={styles.commentStripe}>
                        <div className={styles.idTag}>{currentUserInitials}</div>
                        <form onSubmit={handleSubmit} className={styles.formComment}>
                            <div className={styles.description}>
                                <input 
                                    type="text" 
                                    name="comment"
                                    placeholder='Ajouter un commentaire...'
                                ></input>
                            </div>
                            <button type="submit">Envoyer</button>
                        </form>
                    </div>
                    
                </section>
                
            </section>
        </article>
    )
}

