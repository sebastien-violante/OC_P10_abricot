'use client'

import styles from './page.module.css'
import fetchProject from '@/app/utils/fetchProject'
import Cookies from "js-cookie"
import { useEffect, useState } from 'react'
import { type Task, type CustomInput, type TaskFormData, ProjectFormData } from '@/types/types'
import TaskCard from '@/components/TaskCard/TaskCard'
import Modal from '@/components/Modal/Modal'
import Form from '@/components/Form/Form'
import { useProjectStore } from '@/store/ProjectStore'
import { useTaskStore } from '@/store/TaskStore'
import type { Project, FlashMessage, UpdateProjectResponse, TaskIa } from '@/types/types'
import { useParams } from 'next/navigation'
import { taskSchema } from '@/types/schemas/taskSchema'
import recordTask from '@/app/utils/recordTask'
import editTask from '@/app/utils/editTask'
import getInitials from '@/app/utils/getInitials'
import { useProfile } from '@/app/context/profileContext'
import { useRouter } from 'next/navigation'
import deleteRequest from '@/app/utils/deleteRequest'
import { projectSchema } from '@/types/schemas/projectSchema'
import putRequest from '@/app/utils/putRequest'
import postRequest from '@/app/utils/postRequest'
import getApiErrorMessage from '@/app/utils/getApiErrorMessage'
import { ApiError } from 'next/dist/server/api-utils'
import IaTaskCard from '@/components/IaTaskCard/IaTaskCard'

export default function SingleProject() {
    
    const params = useParams<{ id: string }>()
    const token = Cookies.get('token')
    const router = useRouter()
    const projectId = params.id
    const { profile, setProfile } = useProfile()
    const project = useProjectStore((state) =>
        state.projects.find((p) => p.id === projectId)
    )
    const updateProject = useProjectStore(
        (state) => state.updateProject
    )
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiResponse, setApiResponse] = useState<string>("");
    const tasksInStore = useTaskStore((state) => state.tasks)
    const setTasksInStore = useTaskStore((state) => state.setTasks)
    const addTaskInStore = useTaskStore((state) => state.addTask)
    const updateTaskInStore = useTaskStore((state) => state.updateTask)
    const [openTaskModal, setOpenTaskModal] = useState(false)
    const ctaAvaliable = true
    const [openProjectModal, setOpenProjectModal] = useState(false)
    const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false)
    const [openIaTaskModal, setOpenIaTaskModal] = useState(false)
    const [tasksIa, setTasksIa] = useState<TaskIa[]>([])
    const [isList, setIsList] = useState(true)
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
    
    const toggleIsList = () => {
        setIsList((prev) => !prev)
    }
    
    // Initialisation des données de tâches
    const initTaskData = {
        formTitle: "Créer une tâche",
        ctaLabel: "+ Ajouter une tâche",
        title: "",
        description: "",
        mode: true,
        collaborators: [],
        dueDate: "",
        status: "",
        edit: false,
        taskId: ""
    }
    const [taskData, setTaskData] = useState<TaskFormData>(initTaskData)
    
    // Initialisation des données de projet
    const initProjectData = {
        formTitle: "",
        title: "",
        description: "",
        mode: false,
        ctaLabel: "",
        collaborators: []
    }
    const [projectData, setProjectData] = useState<ProjectFormData>(initProjectData)

    const [promptData, setPromptData] = useState("")

    function handleCreateTask() {
        setOpenTaskModal(true)
    }

    function handleCreateTaskIa() {
        setOpenIaTaskModal(true)
    }

    function editCurrentTask(task: Task) {
        const collaborators = task.assignees.map(assignee => (assignee.user))
        setTaskData({
            formTitle: "Modifier",
            ctaLabel: "Enregistrer",
            title: task.title,
            description: task.description,
            collaborators,
            mode: true,
            dueDate: new Date(task.dueDate).toISOString().split("T")[0],
            status: task.status,
            edit: true,
            taskId: task.id
        })
        setOpenTaskModal(true)
    }

    function closeTaskModal() {
        setOpenTaskModal(false)
        setTaskData(initTaskData)
        setApiResponse("")
    }

    const createTask = async (e: React.FormEvent<HTMLFormElement>, taskId?: string) => {
        
        e.preventDefault();
        if (!token) {
            setFlashMessage({status: false, message: "Vous devez être connecté(e) pour pouvoir modifier une tâche"})
            setTimeout(() => { setFlashMessage(null)}, 2000);
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
        setApiResponse("")

        // Mode modification de tâche : edit et il existe un task.id
        if(taskData.edit && taskData.taskId) {
            const taskId = taskData.taskId
            // Envoi de la requête à l'API
            const response = await editTask({payload, token, projectId, taskId})
            const fetchResult = await response.json()
            if(!fetchResult.success) {
                setApiResponse(fetchResult.message)
                setTaskData(initTaskData)
                return
            }
            // Mise à jour du store pour répercussion sur l'affichage
            updateTaskInStore(fetchResult.data.task)
            // Fermeture de la modale, vidage des données et affichage du message flash
            setOpenTaskModal(false)
            setTaskData(initTaskData)
            setFlashMessage({status: true, message: "La tâche a été modifiée"})
            setTimeout(() => {setFlashMessage(null)}, 2000);
                
        }
        // Mode création de tâche
        else {
            // Envoi
            const response = await recordTask({payload, token, projectId})
            const fetchResult = await response.json()
            if(!fetchResult.success) {
                setApiResponse(fetchResult.message)
                return
            }
            const newTask = fetchResult.data.task
            addTaskInStore(newTask)
            setOpenTaskModal(false)
            setFlashMessage({status: true, message: "La nouvelle tâche a été ajoutée"})
            setTimeout(() => {setFlashMessage(null)}, 2000);
        }
            
    }

    const searchTask = () => {
        console.log('search')
    }

    const returnToProjects = () => {
        router.push("/projets");
    }

    const handleModifyProject = () => {
        if(!project) return
        // On ne peut modifier ou supprimer un projet que si on est propriétaire
        if(project.owner.id !== profile?.id) return
        
        const collaborators = project.members.map(member => (member.user))
        setProjectData({
            formTitle: "Modifier un projet",
            title: project?.name,
            ctaLabel: "Enregistrer",
            description: project?.description,
            mode: false,
            collaborators
        })
        setOpenProjectModal(true)
    }

    const modifyProject = async (e: React.FormEvent<HTMLFormElement>, taskId?: string) => { 
        
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
        
        const zodValidation = projectSchema.safeParse(payload);
        if (!zodValidation.success) {
            const formattedErrors: Record<string, string> = {};
            zodValidation.error.issues.forEach((error) => {
                const field = error.path[0];
                formattedErrors[field as string] = error.message;
            });
            setErrors(formattedErrors);
            return;
        }
        setErrors({});

        // Envoi de la requête
        if(token) {
            const url = `/api/projects/${project?.id}`
            try {
                const result = await putRequest<typeof payload, UpdateProjectResponse>({ url, token, payload })
                if(result.data) {
                    updateProject(result.data.project)
                    setOpenProjectModal(false)
                    setFlashMessage({status: true, message: "Le projet a bien été mis à jour"})
                    setTimeout(() => {setFlashMessage(null)}, 2000);
                }
                
            }  catch(error) {
               setApiResponse(error instanceof Error ? error.message : typeof error === "object" && error !== null && "message" in error  ? String(error.message) : "Une erreur est survenue.")
            }
        }
        
    }
        
    const handleDeleteProject = () => {
        setOpenDeleteProjectModal(true)
    }

    const closeDeleteProjectModal = () => {
        setApiResponse("")
        setOpenDeleteProjectModal(false)
    }

    const deleteProject = async () => {
        if(token) {
            const url = `/api/project/${projectId}`
            try {
                const result = await deleteRequest({ url, token })
                // Mise en cache d'un message de succès pour l'afficher dans la page projets
                localStorage.setItem(
                    "flashBag",
                    JSON.stringify({
                        status: true,
                        message: "le projet a bien été supprimé"
                    })
                )
                router.push('/projets')  
            } catch(error) {
                setApiResponse( error instanceof Error ? error.message : "Une erreur est survenue." );
            }
        }
    }
    const askForIaTasks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!token) {
        router.push('/');
        return;
    }

    if (!promptData.trim()) {
        return;
    }

    const systemPrompt =
        "Décompose la demande de l'utilisateur en tâches concrètes, indépendantes et réalisables. Pour chaque tâche, fournis un titre court et une description concise. Les tâches déjà présentes sont fournies comme contexte. Génère uniquement les nouvelles tâches demandées et ne répète jamais les tâches déjà présentes.";

    const userPrompt =
        `Crée les tâches nécessaires pour répondre à cette demande : ${promptData}`;

    const payload = {
        systemPrompt,
        userPrompt,
        existingTasks: tasksIa,
    };

    try {
        const result = await postRequest<
            typeof payload,
            { response: string }
        >({
            url: "/api/ai",
            token,
            payload,
        });

        if (!result.data) {
            throw new Error("La réponse de l'API est vide");
        }

        const data = JSON.parse(result.data.response);

        // On AJOUTE les nouvelles tâches aux tâches existantes
        setTasksIa((currentTasks) => [
            ...currentTasks,
            ...data.tasks,
        ]);

        // On vide le champ de prompt après traitement
        setPromptData("");

    } catch (error) {
        setApiResponse(
            error instanceof Error
                ? error.message
                : typeof error === "object" &&
                  error !== null &&
                  "message" in error
                    ? String(error.message)
                    : "Une erreur est survenue."
        );
    }
}

    const handleIaTaskChange = (taskIndex: number, changes: Partial<TaskIa>) => {
        setTasksIa((currentTasks) =>
            currentTasks.map((task, index) =>
                index === taskIndex
                    ? { ...task, ...changes }
                    : task
            )
        )
    }

    const handleIaTaskDelete = (taskIndex: number) => {
        console.log('suppr tache')
        setTasksIa((currentTasks) =>
            currentTasks.filter((_, index) => index !== taskIndex)
        )
    }

    const handleSaveIaTasks = async () => {
        tasksIa.forEach(async (task) => {
            // par défaut, la date d'échéance est fixée à 15 jours après l'enregistrement
            const date = new Date();
            date.setDate(date.getDate() + 15);
            const payload = {
                title: task.titre,
                description: task.description,
                dueDate: date
            }

            // Envoi de la requête
            try {
                const data = await postRequest({
                    url: `/api/projects/${projectId}/tasks`,
                    payload,
                    token: token
                })
                setFlashMessage({status: true, message: data.message})
                setTimeout(() => {
                    setFlashMessage(null)
                }, 2000);    
            } catch(error) {
            
                const apiError = error as { 
                    status?: number; 
                    message?: string; 
                    details?: { 
                        field: string; 
                        message: string; }[]; 
                }; 
                
                // Erreur de validation API 
                if (apiError.status === 400) { 
                    setFlashMessage({ status: false, message: "Données invalides.", })
                    return; 
                } 
                // Email déjà utilisé 
                if (apiError.status === 409) { 
                    setFlashMessage({ status: false, message: "Cette adresse email est déjà utilisée.", })
                    return 
                } 
                // Autre erreur 
                setFlashMessage({ status: false, message: "Une erreur est survenue. Veuillez réessayer.", }) 
                setTimeout(() => { setFlashMessage(null); }, 3000);
            }    

        })
        console.log('je vide les taches')
        setTasksIa([])
    }

    const projectFormStructure = {

        title: "Modifier un projet",
        inputs : [ 
            { label : "Titre", type : "text", name : "title", required: true },
            { label : "Description", type: "text", name : "description", required: true },
            { label : "Contributeurs", type: "collaborators", name: "collaborators", required: false }
        ],
    } satisfies {
        title: string;
        inputs: CustomInput[];
    }

    const taskFomStructure = {
        title: "Créer une tâche",
        inputs : [
            { label : "Titre", type : "text", name : "title", required: true },
            { label : "Description", type: "text", name : "description", required: true },
            { label : "Echéance", type: "date", name: "dueDate", required: true },
            { label : "Assignée à :", type: "collaborators", name: "collaborators", required: false },
            { label: "Statut", type: "status", name: "status", required: true, options: [ { label: "À faire", value: "TODO" }, { label: "En cours", value: "IN_PROGRESS" }, { label: "Terminée", value: "DONE" } ] }
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
                            {project?.name}
                            {(project?.owner.id === profile?.id )&& 
                                <>
                                    <button className={styles.modifyProject} onClick={handleModifyProject}>Modifier</button>
                                    <button className={styles.deleteProject} onClick={handleDeleteProject}>Supprimer</button>
                                </>  
                            }
                            
                        </div>
                        <span>{project?.description}</span>
                    </div>
                </article>
                <div className={styles.buttons}>
                    <button 
                        className={styles.createTaskBtn}
                        type="button"
                        onClick={handleCreateTask}
                        aria-haspopup="dialog">
                            Créer une tâche
                    </button>
                    <button 
                        className={styles.createTaskIaBtn}
                        type="button"
                        onClick={handleCreateTaskIa}
                        aria-haspopup="dialog">
                            <img src="/pictures/static/white-star.svg" alt="" aria-hidden="true"/>
                            IA
                    </button>
                </div>
            </section>

            <section className={styles.main}>
               <section className={styles.contributors}>
                <div className={styles.totalContributors}>
                    Contributeurs <span>{(project?.members.length ?? 0) + 1} {project?.members.length === 0 ? "personne" : "personnes"}</span>
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
                            <option value="" disabled>
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
                
                {openTaskModal && (
                    <Modal titleId="createTask" onClose={closeTaskModal}>
                        <Form data={taskFomStructure} formData={taskData} setFormData={setTaskData} handleSubmit={createTask} errors={errors} apiResponse={apiResponse} ></Form>
                    </Modal>
                )}
                </section>
                {openProjectModal && (
                    <Modal titleId="modifyProject" onClose={()=>setOpenProjectModal(false)}>
                        <Form data={projectFormStructure} formData={projectData} setFormData={setProjectData} handleSubmit={modifyProject} errors={errors} apiResponse={apiResponse}></Form>
                    </Modal>
                )}
                {openIaTaskModal && (
                    <Modal titleId="createTaskIa" onClose={()=>setOpenIaTaskModal(false)}>
                        <section className={styles.taskIaContainer}>
                            <div className={styles.header}>
                                <img src="/pictures/static/star-orange.svg" alt="" aria-hidden="true"/>
                                <h2>{!tasksIa ? "Créer une tâche" : "Vos tâches..."}</h2>
                            </div>
                            <div className={styles.tasksWrapper}>
                                {tasksIa?.map((task, index) => (
                                    <IaTaskCard 
                                        task={task} 
                                        key={index} 
                                        onChange={(changes) => handleIaTaskChange(index, changes)} 
                                        onDelete={() => handleIaTaskDelete(index)}/>
                                ))}
                            </div>
                            <div className={styles.registerTasks}>
                                { tasksIa && 
                                    (<button
                                        type="button"
                                        onClick={handleSaveIaTasks}
                                        className={styles.addIaTasksBtn}
                                    >
                                    + Ajouter les tâches
                                    </button>)
                                }
                            </div>
                            
                            <form className={styles.tasksIaForm} onSubmit={askForIaTasks}>
                                <label htmlFor='prompt' className={styles.visuallyHidden}>prompt</label>
                                <div className={styles.prompt}>
                                    <input 
                                        type="text" 
                                        id="prompt" 
                                        name="prompt"
                                        placeholder='Décrivez les tâches que vous souhaitez ajouter...'
                                        onChange={(e) => setPromptData(e.target.value)}>
                                    </input>
                                    <button type="submit">
                                        <img src="/pictures/static/ia-button.svg" alt="" aria-hidden="true"/>
                                    </button>
                                </div>
                                
                            </form>
                            


                        </section>
                        
                    </Modal>
                )}
                {openDeleteProjectModal && (
                    <Modal titleId="deleteProject" onClose={closeDeleteProjectModal}>
                        <div className={styles.modalDeleteProject}>
                            <h3>Etes-vous sûr(e) de vouloir supprimer ce message ?</h3>
                            <span className={styles.apiResponse}>{apiResponse}</span>
                            <button 
                                type="button"
                                onClick={deleteProject}
                            >Confirmer</button>
                        </div>
                    </Modal>
                )} 
            </section>
            {/* MESSAGE GLOBAL */}
            {flashMessage && (
                <div  
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg ${flashMessage.status ? "bg-green-500" : "bg-red-500"} px-6 py-4 text-white shadow-lg`}
                    role={ flashMessage.status ? 'status' : 'alert' } 
                    aria-live={ flashMessage.status ? 'polite' : 'assertive' }
                >
                    {flashMessage.message}
                </div>
            )}
        </div>
    )
}