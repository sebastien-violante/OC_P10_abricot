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
import { useSelectedProject } from '@/store/SelectedProjectStore'
import type { Project } from '@/types/types'
import { useParams } from 'next/navigation'
import { taskSchema } from '@/types/schemas/taskSchema'
import recordTask from '@/app/utils/recordTask'
import editTask from '@/app/utils/editTask'
import { projectWriteAnalyzeData } from 'next/dist/build/swc/generated-native'
import getInitials from '@/app/utils/getInitials'
import { useProfile } from '@/app/context/profileContext'
import { useRouter } from 'next/navigation'
import deleteRequest from '@/app/utils/deleteRequest'
import { projectSchema } from '@/types/schemas/projectSchema'
import recordProject from '@/app/utils/recordProject'

export default function SingleProject() {
    const params = useParams<{ id: string }>()
    const token = Cookies.get('token')
    const router = useRouter()
    const projectId = params.id
    const { profile, setProfile } = useProfile()
    const project = useProjectStore((state) =>
        state.projects.find((p) => p.id === projectId)
    )
   
    const setSelectedProject = useSelectedProject((state) => state.setProject)
    const updateSelectedProject = useSelectedProject((state) => state.updateProject)
    useEffect(() => {
        if (project) {
            setSelectedProject(project)
        }
    }, [project, setSelectedProject])
    const selectedProject = useSelectedProject((state) => state.project)
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
    const [deleteProject, setDeleteProject] = useState(false)
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isList, setIsList] = useState(true)
    

    const toggleIsList = () => {
        setIsList((prev) => !prev)
    }

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

    function handleClickIa() {
        console.log('IA')
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

    const returnToProjects = () => {
        router.push("/projets");
    }

    const handleModifyProject = () => {
        if(!selectedProject) return
        // On ne peut modifier ou supprimer un projet que si on est propriétaire
        if(selectedProject.owner.id !== profile?.id) return
        
        const collaborators = selectedProject.members.map(member => (member.user))
        setProjectData({
            formTitle: "Modifier un projet",
            title: selectedProject?.name,
            ctaLabel: "Enregistrer",
            description: selectedProject?.description,
            collaborators
        })
        console.log(projectData)
        setModifyProject(true)
    }

    const confirmModifyProject = async (e: React.FormEvent<HTMLFormElement>, taskId?: string) => { 
        
        e.preventDefault();
        if (!token) {
            router.push('/');
            return;
        }   
        // validation des données de formulaire
        const payload = {
            name: projectData.title,
            description: projectData.description,
            contributors: projectData.collaborators.map(({ email }) => email)
            };
        
        const result = projectSchema.safeParse(payload);
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
        
        const response = await recordProject({payload, token})
        const fetchResult = await response.json()
        const modifiedProject = fetchResult.data.project 
        setSelectedProject(modifiedProject)
        setApiResponse(fetchResult.message)
    }
        

    const handleDeleteProject = () => {
        setDeleteProject(true)
    }

    const confirmDeleteProject = async () => {
        // Vérification de la connexion de l'utilisateur
        const token = Cookies.get('token')
        if(token) {
            const url = `/api/projects/${projectId}`
            console.log(token)
            console.log(url)
            const result = await deleteRequest({ url, token })
            if(result.success) {
                router.push('/projets')
                // Mise en cache d'un message de succès pour l'afficher dans la page projets
                localStorage.setItem(
                    "flashBag",
                    JSON.stringify({
                        status: true,
                        message: "le projet a bien été supprimé"
                    })
                )
            }
        }
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
    }

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
                    label : "Echéance", 
                    type: "date", 
                    name: "dueDate", 
                    required: true
                },
                {
                    label : "Assignée à :", 
                    type: "collaborators", 
                    name: "collaborators", 
                    required: false
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
        }

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
            loadTasks(token)
        }, [token])

    
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
                <article className={styles.label}>
                    <button onClick={returnToProjects}>
                        <span className={styles.visuallyHidden}>
                            Retour à la liste des projets
                        </span>
                        <img 
                            src="/pictures/static/back-arrow.svg"
                            alt=""
                            aria-hidden="true"
                            aria-label="Revenir à la liste des projets"/>
                        </button>
                    <div className={styles.left}>
                        <div className={styles.data}>
                            {selectedProject?.name}
                            {(selectedProject?.owner.id === profile?.id )&& 
                                <>
                                    <button className={styles.modifyProject} onClick={handleModifyProject}>Modifier</button>
                                    <button className={styles.deleteProject} onClick={handleDeleteProject}>Supprimer</button>
                                </>  
                            }
                            
                        </div>
                        <span>{selectedProject?.description}</span>
                    </div>
                </article>
                <div className={styles.buttons}>
                    <button 
                        className={styles.createTaskBtn}
                        type="button"
                        onClick={handleClick}
                        aria-haspopup="dialog">
                            Créer une tâche
                    </button>
                    <button 
                        className={styles.createTaskIaBtn}
                        type="button"
                        onClick={handleClickIa}
                        aria-haspopup="dialog">
                            <img src="/pictures/static/star-orange.svg" alt="" aria-hidden="true"/>
                            IA
                    </button>
                </div>
            </section>

            <section className={styles.main}>
               <section className={styles.contributors}>
                <div className={styles.totalContributors}>
                    Contributeurs <span>{(selectedProject?.members.length ?? 0) + 1} {selectedProject?.members.length === 0 ? "personne" : "personnes"}</span>
                </div>
                <div className={styles.detailsContributors}>
                    <div className={styles.idTag}>
                        <p className={styles.ownerId}>{getInitials(project?.owner.name)}</p>
                        <p className={styles.ownerName}>Propriétaire</p>
                    </div>
                    
                    {selectedProject?.members.map((member)=>(
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
                        <button className={`${styles.displayTask} ${isList ? styles.selected : ""}`} onClick={toggleIsList}>
                            <img 
                                src="/pictures/static/coche-orange.svg"
                                alt=""
                                aria-hidden="true"
                            />
                            <span>Liste</span>
                        </button>
                        <button className={`${styles.displayTask} ${isList ? "" : styles.selected}`} onClick={toggleIsList}>
                            <img 
                                src="/pictures/static/calendar-orange.svg"
                                alt=""
                                aria-hidden="true"
                            />
                            <span>Calendrier</span>
                        </button>
                        <select id="status" name="status" required>
                            <option value="" selected disabled>
                                Statut
                            </option>
                            <option value="low">Faible</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                        </select>
                        <form className={styles.searchForm}>
                            <label htmlFor="task-search" className={styles.visuallyHidden}>
                                Rechercher une tâche
                            </label>
                            <input 
                                 id="task-search"
                                 type="text" 
                                 name="search" 
                                 placeholder="Rechercher une tâche"></input>
                            <button type="submit" onClick={searchTask}>
                                <span className={styles.visuallyHidden}>
                                    Rechercher des tâches
                                </span>
                                <img 
                                    src="/pictures/static/search.svg"
                                    alt=""
                                    aria-hidden="true"
                                    aria-label="Rechercher des tâches"
                                    />
                                </button>
                        </form>

                    </div>
                </section>
                <section className={styles.tasksWrapper}>
                    {tasksInStore?.length===0 && (<p>Le projet ne comporte pas encore de tâches. Créez-en une en cliquant sur le bouton &quot;Créer une tâche&quot;</p>)}  
                    {tasksInStore?.map((task)=>(
                        <div className={styles.taskWrapper} key={task.id}>
                            <TaskCard  task={task} projectId={projectId} token={token} editCurrentTask={editCurrentTask} ctaAvaliable={ctaAvaliable}/> 
                        </div>
                    ))}
                </section>
                
                {isOpen && (
                    <Modal onClose={closeModal}>
                        <Form data={taskFomStructure} formData={taskData} setFormData={setTaskData} handleSubmit={handleSubmit} errors={errors} apiResponse={apiResponse} ></Form>
                    </Modal>
                )}
                </section>
                {modifyProject && (
                    <Modal titleId="modifyProject" onClose={()=>setModifyProject(false)}>
                        <Form data={projectFormStructure} formData={projectData} setFormData={setProjectData} handleSubmit={confirmModifyProject} errors={errors} apiResponse={apiResponse}></Form>
                    </Modal>
                )}
                {deleteProject && (
                    <Modal titleId="deleteProject" onClose={()=>setDeleteProject(false)}>
                        <div className={styles.modalDeleteProject}>
                            <h3>Etes-vous sûr(e) de vouloir supprimer ce message ?</h3>
                            <button 
                                type="button"
                                onClick={confirmDeleteProject}
                            >Confirmer</button>
                        </div>
                    </Modal>
                )}
                {errorMessage && (
                <div className="fixed top-5 right-5 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg">
                    {errorMessage}
                </div>
            )} 
            </section>
            
        </div>
    )
}