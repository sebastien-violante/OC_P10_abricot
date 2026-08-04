'use client'

import styles from './page.module.css'
import fetchProject from '@/app/utils/fetchProject'
import Cookies from "js-cookie"
import { useEffect, useState } from 'react'
import { type Task, type CustomInput, type TaskFormData, ProjectFormData } from '@/types/types'
import TaskCard from '@/components/TaskCard/TaskCard'
import Modal from '@/components/Modal/Modal'
import Form from '@/components/Form/Form'
import Button from '@/components/Button/Button'
import { useProjectStore } from '@/store/ProjectStore'
import { useTaskStore } from '@/store/TaskStore'
import type { Project } from '@/types/types'
import { useParams } from 'next/navigation'
import { taskSchema } from '@/types/schemas/taskSchema'
import recordTask from '@/app/utils/recordTask'
import editTask from '@/app/utils/editTask'
import { projectWriteAnalyzeData } from 'next/dist/build/swc/generated-native'
import getInitials from '@/app/utils/getInitials'
import { useProfile } from '@/app/context/profileContext'

export default function SingleProject() {
    const params = useParams<{ id: string }>()
    const projectId = params.id
    const { profile, setProfile } = useProfile()
    console.log(profile)
    const project = useProjectStore((state) =>
        state.projects.find((p) => p.id === projectId)
    )
    const token = Cookies.get('token')
    console.log(project)
    //const [tasks, setTasks] = useState<Task[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiResponse, setApiResponse] = useState<string>("");
    const tasksInStore = useTaskStore((state) => state.tasks)
    const setTasksInStore = useTaskStore((state) => state.setTasks)
    const addTaskInStore = useTaskStore((state) => state.addTask)
    const updateTaskInStore = useTaskStore((state) => state.updateTask)
    const [isOpen, setIsOpen] = useState(false)
    const ctaAvaliable = true
    const [modifyProject, setModifyProject] = useState(false)
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const initProjectData = {
        formTitle: "",
        title: "",
        description: "",
        ctaLabel: "",
        collaborators: []
    }
    // Objet de récupération des données de formulaire

    const initTaskData = {
        formTitle: "Créer une tâche",
        ctaLabel: "+ Ajouter une tâche",
        title: "",
        description: "",
        collaborators: [],
        dueDate: "",
        status: "",
        edit: false,
        taskId: ""
    }
    const [taskData, setTaskData] = useState<TaskFormData>(initTaskData)
    const [projectData, setProjectData] = useState<ProjectFormData>(initProjectData)

    function handleClick() {
        setIsOpen(true)
    }

    function editCurrentTask(task: Task) {
        const collaborators = task.assignees.map(assignee => (assignee.user))
        setTaskData({
            formTitle: "Modifier",
            ctaLabel: "Enregistrer",
            title: task.title,
            description: task.description,
            collaborators,
            dueDate: new Date(task.dueDate).toISOString().split("T")[0],
            status: task.status,
            edit: true,
            taskId: task.id
        })
        setIsOpen(true)
    }


    function closeModal() {
        setIsOpen(false)
        setTaskData(initTaskData)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, taskId?: string) => {
        
        e.preventDefault();
        if (!token) {
        setApiResponse("Vous devez être connecté.");
        return;
    }
        // Création de la payload en fonction du formData
        const payload = {
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            assigneeIds: taskData.collaborators.map(({ id }) => id),
            status: taskData.status
        };
        console.log(payload)

        // Validation des données par le schéma Zod
        const result = taskSchema.safeParse(payload);
            if (!result.success) {
                const formattedErrors: Record<string, string> = {};
                result.error.issues.forEach((error) => {
                    const field = error.path[0];
                    formattedErrors[field as string] = error.message;
                });
                setErrors(formattedErrors);
                return;
            }
            setErrors({});
            if(taskData.edit && taskData.taskId) {
                const taskId = taskData.taskId
                const response = await editTask({payload, token, projectId, taskId})
                const fetchResult = await response.json()
                console.log(fetchResult)
                updateTaskInStore(fetchResult.data.task)
            }
            else {
                const response = await recordTask({payload, token, projectId})
                const fetchResult = await response.json()
                console.log(fetchResult)
                const newTask = fetchResult.data.task
                setApiResponse(fetchResult.message)
                addTaskInStore(newTask)
            }
            
    }

    const searchTask = () => {
        console.log('search')
    }

    const handleModifyProject = () => {
        console.log(project)
        if(!project) return
        if(project.owner.id !== profile?.id) {
            setErrorMessage("Vous n'êtes pas propiétaire du projet. Vous ne pouvez pas le modifier")
                setTimeout(() => {
                setErrorMessage("")
            }, 3000);
            return
        }
        const collaborators = project.members.map(member => (member.user))
        
        setProjectData({
            formTitle: "Modifier un projet",
            title: project?.name,
            ctaLabel: "Enregistrer",
            description: project?.description,
            collaborators
        })
        setModifyProject(true)
    }


    const projectFormStructure = {

        title: "Modifier un projet",
        inputs : [
            {
                label : "Titre", 
                type : "text", 
                name : "title", 
                required: true, 
            },
            {
                label : "Description", 
                type: "text", 
                name : "description", 
                required: true
            },
            {
                label : "Contributeurs", 
                type: "collaborators", 
                name: "collaborators", 
                required: false
            }
        ],
    } satisfies {
        title: string;
        inputs: CustomInput[];
    };

    const taskFomStructure = {
            title: "Créer une tâche",
            inputs : [
                {
                    label : "Titre", 
                    type : "text", 
                    name : "title", 
                    required: true, 
                },
                {
                    label : "Description", 
                    type: "text", 
                    name : "description", 
                    required: true
                },
                
                {
                    label : "Assignée à :", 
                    type: "collaborators", 
                    name: "collaborators", 
                    required: false
                },
                
                {
                    label : "Echéance", 
                    type: "date", 
                    name: "dueDate", 
                    required: true
                },
                {
                    label: "Statut",
                    type: "status",
                    name: "status",
                    required: true,
                    options: [
                        { label: "À faire", value: "TODO" },
                        { label: "En cours", value: "IN_PROGRESS" },
                        { label: "Terminée", value: "DONE" },
                    ],
                }
            ],
        } satisfies {
            title: string;
            inputs: CustomInput[];
        };
/*
    if (!token) {
        throw new Error("Token manquant");
    }
*/
    useEffect (() => {
        if(!token) {
            return
        }
            const id = projectId
            async function loadTasks(token: string) {
                try {
                    const tasks = await fetchProject({id, token})
                    setTasksInStore(tasks)
                    
                    console.log(tasks)
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
            loadTasks(token);
        }, [token]);

    
     if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }
    
   
    return (
        <div className={styles.singleProjectWrapper}>
            <section className={styles.banner}>
                <div className={styles.projectHeader}>
                    <div className={styles.label}>
                        Nom du projet
                        <button className={styles.modifyProject} onClick={handleModifyProject}>Modifier</button>
                    </div>
                    {project?.name}
                </div>
                <div className={styles.buttons}>
                    <Button color={"black"} width={"mediumplus"} onClick={handleClick}>Créer une tâche</Button>
                    <Button color={"orange"} width={"small"} onClick={handleClick}>IA</Button>
                </div>
            </section>
            <section className={styles.contributors}>
                <div className={styles.totalContributors}>
                    Contributeurs <span>{(project?.members.length ?? 0) + 1} {project?.members.length == 0 ? "personne" : "personnes"}</span>
                </div>
                <div className={styles.detailsContributors}>
                    <div className={styles.idTag}>
                        <p className={styles.ownerId}>{getInitials(project?.owner.name)}</p>
                        <p className={styles.ownerName}>Propriétaire</p>
                    </div>
                    
                    {project?.members.map((member)=>(
                        <div key={member.id} className={styles.idTag}>
                            <p className={styles.memberId}>{getInitials(member.user.name)}</p>
                            <p className={styles.memberName}>{member.user.name}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.taskList}>
                <section className={styles.header}>
                    <div className={styles.label}>
                        <span>Tâches</span>
                        <span>Par ordre de priorité</span>
                    </div>
                    <div className={styles.cta}>
                        <button className={`${styles.displayTask}`}>
                            <img src="/pictures/static/coche-orange.svg"/>
                            Liste</button>
                        <button className={`${styles.displayTask}`}>
                            <img src="/pictures/static/calendar-orange.svg"/>
                            Calendrier</button>
                        <select id="status" name="status" required>
                            <option value="" selected disabled>
                                Statut
                            </option>
                            <option value="low">Faible</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                        </select>
                        <form className={styles.searchForm}>
                            <input type="text" name="search" placeholder="Rechercher une tâche"></input>
                            <button type="submit" onClick={searchTask}><img src="/pictures/static/search.svg"/></button>
                        </form>

                    </div>
                </section>
                {tasksInStore?.length===0 && (<p>Le projet ne comporte pas encore de tâches. Créez-en une en cliquant sur le bouton &quot;Créer une tâche&quot;</p>)}  
                {tasksInStore?.map((task)=>(
                    <TaskCard key={task.id} task={task} projectId={projectId} token={token} editCurrentTask={editCurrentTask} ctaAvaliable={ctaAvaliable}/>
                ))}
                {isOpen && (
                    <Modal onClose={closeModal}>
                        <Form data={taskFomStructure} formData={taskData} setFormData={setTaskData} handleSubmit={handleSubmit} errors={errors} apiResponse={apiResponse} ></Form>
                    </Modal>
                )}
                </section>
                {modifyProject && (
                    <Modal onClose={()=>setModifyProject(false)}>
                        <Form data={projectFormStructure} formData={projectData} setFormData={setProjectData} handleSubmit={handleSubmit} errors={errors} apiResponse={apiResponse}></Form>
                    </Modal>
                )}
                {errorMessage && (
                <div className="fixed top-5 right-5 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg">
                    {errorMessage}
                </div>
            )}
        </div>
    )
}