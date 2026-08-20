'use client'

import styles from './TaskCard.module.css'
import { useRouter } from "next/navigation"

import type { Task, FlashMessage, AddCommentResponse } from '@/types/types'

import getInitials from '@/app/utils/getInitials'
import deleteRequest from '@/app/utils/deleteRequest'
import postRequest from '@/app/utils/postRequest'
import { formatDateWithHour } from '@/app/utils/formatDate'

import TaskStatus from '../TaskStatus/TaskStatus'
import Modal from '../Modal/Modal'

import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { useTaskStore } from '@/store/TaskStore'
import { useCommentStore } from '@/store/CommentStore'
import { useProfile } from '@/app/context/profileContext'

type TaskCardProps = {
    task: Task;
    projectId: string;
    token?: string;
    editCurrentTask?: (task: Task) => void;
    ctaAvaliable: boolean;
    isAllowedToCta : boolean;
    setIsAllowedToCta: Dispatch<SetStateAction<boolean>>
}

export default function TaskCard({task, projectId, token, editCurrentTask, ctaAvaliable, isAllowedToCta, setIsAllowedToCta}: TaskCardProps) {

    const router = useRouter()
    const { profile } = useProfile()
    const currentUserInitials = profile ? getInitials(profile.name) : ''

    // Store des commentaires
    const commentsInStore = useCommentStore((state) => state.comments)
    const setComments = useCommentStore((state) => state.setComments)
    const addCommentInStore = useCommentStore((state) => state.addComment)

    const removeTaskInStore = useTaskStore((state) => state.removeTask)
    const [apiResponse, setApiResponse] = useState<string>("")
    const [displayComments, setDisplayComments] = useState(false)
    const [cta, setCta] = useState(false)
    const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false)
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
    const ctaRef = useRef<HTMLDivElement | null>(null)
    const firstCtaRef = useRef<HTMLButtonElement | null>(null)
    const lastCtaRef = useRef<HTMLButtonElement | null>(null)
    const ctaButtonRef = useRef<HTMLButtonElement | null>(null)
    
    // Vérification des droits d'accès au menu modification/suppression
    const isAssignee = task.assignees?.some(
            assignee => assignee.user.id === profile?.id
        ) ?? false;
    const canAccessCta = isAllowedToCta || isAssignee

    const commentsButtonRef = useRef<HTMLButtonElement | null>(null) // Référence de gestion du focus
    const commentsId = `task-comments-${task.id}`
    const actionsId = `task-actions-${task.id}`
    const titleId = `task-title-${task.id}`

    useEffect(() => {
        setComments(task.comments ?? [])
    }, [task.comments, setComments])

    
    // Gestion de l'ouverture / fermeture des commentaires.
    function toggleComments() {
        setDisplayComments((prev) => !prev)
    }

    // Gestion de l'ouverture / fermeture du menu modification/suppression
    function toggleCta() {
        setCta((prev) => !prev)
    }

    useEffect(() => {
        if (cta) {
            requestAnimationFrame(() => {
                firstCtaRef.current?.focus()
            })
        }
    }, [cta])

    // foccusTrap 
    useEffect(() => {
        if (!cta) return
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setCta(false)
                requestAnimationFrame(() => {
                    ctaButtonRef.current?.focus()
                })
                return
            }
            if (event.key !== 'Tab') return
            const first = firstCtaRef.current
            const last = lastCtaRef.current

            if (!first || !last) return
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            }

            if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [cta])


    async function editTask() {
        editCurrentTask?.(task)
        setCta(false)
    }

    async function removeTask() {
        if (token) {
            setApiResponse("")

            const taskId = task.id!
            const url = `/api/projects/${projectId}/tasks/${taskId}`

            try {
                await deleteRequest({ url, token })
                removeTaskInStore(task.id!)
                setOpenDeleteTaskModal(false)
                setCta(false)
                setFlashMessage({ status: true, message :"La tâche a été supprimée"}) 
                setTimeout(() => {setFlashMessage(null)}, 2000);

            } catch (error) {
                setApiResponse(
                    error instanceof Error
                        ? error.message
                        : "Une erreur est survenue."
                )
            }
        }
    }

    async function handleAddComment(e: React.FormEvent<HTMLFormElement>) {
        
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
        const payload = { content: comment }

        try {
            const url= `/api/projects/${projectId}/tasks/${taskId}/comments`
            const result = await postRequest<typeof payload, AddCommentResponse>({url, token, payload})
            if(result.data?.comment) {
                addCommentInStore(result.data?.comment)
            }
            form.reset()
        } catch(error) {
            const message = error instanceof Error ? error.message : "Une erreur est survenue";
            setFlashMessage({ status: false, message: message }) 
            setTimeout(() => {setFlashMessage(null)}, 2000);
        }
    }
    
    // Gestion de la fermeture de menu modifier/supprimer par clic en dehors du menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                ctaRef.current &&
                !ctaRef.current.contains(event.target as Node)
            ) {
                setCta(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    
    return (
        <article className={styles.taskCardWrapper} aria-labelledby={titleId}>

            <header className={styles.taskCardTop}>
                <div className={styles.leftData}>
                    <div className={styles.taskCardHeader}>
                        <h2 id={titleId} className={styles.taskCardTitle}>
                            {task.title}
                        </h2>
                        <TaskStatus status={task.status} mode={"card"} />
                    </div>
                    {task.description && (
                        <p className={styles.description}>
                            {task.description}
                        </p>
                    )}
                </div>

                {ctaAvaliable && canAccessCta && (
                    <div className={styles.cta} ref={ctaRef}>
                        <button
                            ref={ctaButtonRef}
                            type="button"
                            onClick={toggleCta}
                            aria-expanded={cta}
                            aria-controls={actionsId}
                            aria-label={`Actions pour la tâche ${task.title}`}
                            className={styles.ctaButton}
                        >
                            <img className={styles.taskCta} src="/pictures/static/taskCta.svg" alt="" aria-hidden="true"/>
                        </button>

                        {cta && (
                            <div className={styles.taskCtaProposals} id={actionsId}>
                                <ul className={styles.ul}>
                                    <li>
                                        <button
                                            ref={firstCtaRef}
                                            type="button"
                                            onClick={editTask}
                                            className={styles.li}
                                        >
                                            <span>Modifier</span>
                                            <img src="/pictures/static/pen.svg" alt="" aria-hidden="true" />
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            ref={lastCtaRef}
                                            type="button"
                                            onClick={() =>
                                                setOpenDeleteTaskModal(true)
                                            }
                                            className={styles.li}
                                        >
                                            <span>Supprimer</span>
                                            <img src="/pictures/static/bin.svg" alt="" aria-hidden="true"/>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <section className={styles.dueDate} aria-label={`echéance tâche ${task.title}`}>
                <span>Échéance :</span>
                <img className={styles.calendarPicture} src="/pictures/static/calendar.svg"  alt="" aria-hidden="true"/>

                <time className={styles.taskDueDate} dateTime={task.dueDate}>
                    {new Date(task.dueDate!).toLocaleDateString(
                        "fr-FR",
                        {
                            day: "numeric",
                            month: "long"
                        }
                    )}
                </time>
            </section>

            <section className={styles.assignees}>
                <span>Assigné à :</span>
                <div className={styles.taskAssignees}>
                    {task.assignees?.map((assignee) => (
                        <div className={styles.assignee} key={assignee.id}>
                            <span className={styles.initialBadge} aria-hidden="true">
                                {getInitials(assignee.user.name)}
                            </span>
                            <span className={styles.fullNameBadge}>
                                {assignee.user.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.comments}>
                <button
                    ref={commentsButtonRef}
                    type="button"
                    className={styles.commentsHeader}
                    onClick={toggleComments}
                    aria-expanded={displayComments}
                    aria-controls={commentsId}
                >
                    <span className={styles.label}>Commentaires ({commentsInStore?.length ?? 0})</span>
                    <img 
                        src="/pictures/static/chevron.svg" 
                        className={`${styles.showCommentsCta} ${
                            displayComments
                                ? styles.rotate
                                : ''
                        }`}
                        alt=""
                        aria-hidden="true"
                    />
                </button>
                <div
                    id={commentsId}
                    className={`${styles.commentsArea} ${
                        displayComments
                            ? styles.extended
                            : ''
                    }`}
                    hidden={!displayComments}
                >
                  
                    {commentsInStore?.map((comment, index) => (
                        <article key={comment.id} className={styles.commentStripe}>
                            <div className={styles.initialBadge} aria-hidden="true">
                                {getInitials(comment.author.name)}
                            </div>
                            <div className={styles.description}>
                                <header className={styles.leftSide}>
                                    <strong className={styles.commentAuthor}>{comment.author.name}</strong>
                                    <p className={styles.commentContent}>{comment.content}</p>
                                </header>
                                <time className={styles.createdAt} dateTime={comment.createdAt}>
                                    {formatDateWithHour(
                                        comment.createdAt
                                    )}
                                </time>
                            </div>
                        </article>
                    ))}

                    {ctaAvaliable && (
                        <div className={styles.commentStripe}>
                            {profile && (
                                <div className={styles.initialCurrentUserBadge} aria-hidden="true">{currentUserInitials}</div>
                            )}
                            <form onSubmit={handleAddComment} className={styles.formComment}>
                                <div className={styles.description}>
                                    <label
                                        htmlFor={`comment-${task.id}`}
                                        className={
                                            styles.visuallyHidden
                                        }
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

                                <button className={styles.sendComment} type="submit">
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            {openDeleteTaskModal && (
                <Modal
                    titleId="deleteTask"
                    onClose={() =>
                        setOpenDeleteTaskModal(false)
                    }
                >
                    <div className={styles.modalDeleteTask}>
                        <h3>Êtes-vous sûr(e) de vouloir supprimer cette tâche ? </h3>
                        <span className={styles.apiResponse}>{apiResponse}</span>

                        <button type="button" onClick={removeTask}>
                            Confirmer
                        </button>
                    </div>
                </Modal>

            )}
            
            {flashMessage && (
                <div  
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg ${flashMessage.status ? "bg-green-500" : "bg-red-500"} px-6 py-4 text-white shadow-lg`}
                    role={ flashMessage.status ? 'status' : 'alert' } 
                    aria-live={ flashMessage.status ? 'polite' : 'assertive' }
                >
                    {flashMessage.message}
                </div>
            )}
        </article>
    )
}
