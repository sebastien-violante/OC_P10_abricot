'use client'

import styles from './page.module.css'
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import type { FlashMessage, Project, Task, KanbanLists, ProjectFormData, CustomInput, GetTasksData } from "@/types/types";

import sortTasksByDate from "@/app/utils/sortTasksByDate";
import sortTasksByStatus from "@/app/utils/sortTasksByStatus";
import postRequest from "@/app/utils/postRequest";
import getRequest from "@/app/utils/getRequest";

import { useProfile } from '@/app/context/profileContext'
import { useSelectedTask } from "@/store/SelectedTaskStore";
import { useProjectStore } from '@/store/ProjectStore'

import Banner from "@/components/Banner/Banner";
import TaskStrip from "@/components/TaskStrip/TaskStrip";
import KanbanColumn from "@/components/KanbanColumn/KanbanColumn";
import Modal from "@/components/Modal/Modal"
import Form from "@/components/Form/Form";
import TaskCard from "@/components/TaskCard/TaskCard";

import { projectSchema } from "@/types/schemas/projectSchema";

export default function Dashboard() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    const { profile, setProfile } = useProfile()
    const title="Tableau de bord"
    const subtitle=`Bonjour ${profile?.name}, voici un aperçu de vos projets et tâches`

    // STATES ///////////////////////////////////////////////////////////////////////////
    const [tasksByDate, setTasksByDate] = useState<Task[] | null>(null) // tâches triées par date pour l'affichage en liste
    const [tasksForKanban, setTasksForKanban] = useState<KanbanLists | null>(null)  // tâches triées par statut pour l'affichage Kanban
    const [loading, setLoading] = useState(true) // chargement du spinner (true)
    const [kanban, setKanban] = useState(false) // mode affichage kanban (true) ou affichage liste (false)
    const [errors, setErrors] = useState<Record<string, string>>({}); 
    const [createProjectForm, setCreateProjectForm] = useState(false) // ouverture modale de création de projet
    const [apiResponse, setApiResponse] = useState("") // réponses api lors du fetch
    
    
    // Objet de récupération des données de formulaire
    const [formData, setFormData] = useState<ProjectFormData>({
        formTitle: "Créer un projet",
        name: "",
        ctaLabel: "Ajouter un projet",
        description: "",
        mode: true, // true permet de choisir les collaborateurs, false les affiche sans action possible
        contributors: [] 
    })

    // Objet de composition du formulaire
    const data = {
        title: "Créer un projet",
        inputs : [
            {label : "Titre", type : "text", name : "name", required: true},
            {label : "Description", type: "text", name : "description", required: true},
            {label : "Contributeurs", type: "collaborators", name: "contributors", required: true}
        ],
    } satisfies {
        title: string;
        inputs: CustomInput[];
    }

    const ctaAvaliable = false
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
       
    // TACHES ///////////////////////////////////////////////////////////////////////////////////////////////
    const selectedTask = useSelectedTask((state) => state.task)
    const removeTask = useSelectedTask((state) => state.removeTask)

    // PROJETS ///////////////////////////////////////////////////////////////////////////////////////////////
    const addProjectInStore = useProjectStore((state) => state.addProject)

    function handleCreateProject() {
        setCreateProjectForm(true)
    }

    async function createProject(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
         if (!token) {
            router.push('/');
            return;
        }   
        // validation des données de formulaire
        const payload = {
            name: formData.name,
            description: formData.description,
            contributors: formData.contributors.map(({ email }) => email)
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

        try {
            const url = "api/projects"
            const result = await postRequest<typeof payload,{ project: Project }>({ url, token, payload })
            addProjectInStore(result.data!.project)
            setCreateProjectForm(false)
            setFlashMessage({ status: true, message: "Le nouveau projet est enregistré", }) 
            setTimeout(() => {setFlashMessage(null)}, 2000);
        } catch(error) {
            const message = error instanceof Error ? error.message : "Une erreur est survenue";
            setFlashMessage({ status: false, message: message }) 
            setTimeout(() => {setFlashMessage(null)}, 2000);
        }       
    }

    // DEBOUNCE 
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect (() => {
        if(!token) {
            router.push('/')
            return
        }
        async function loadDashboard(token: string) {
            try {
                const url = "/api/dashboard/assigned-tasks"
                const result = await getRequest<GetTasksData>({url, token})
                const tasks = result.data?.tasks
                if(tasks) {
                    const filteredTasksByDate = sortTasksByDate(tasks)
                    setTasksByDate(filteredTasksByDate);
                    const filteredTasksByStatus = sortTasksByStatus(tasks)
                    setTasksForKanban(filteredTasksByStatus);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard(token);
    }, [token, router]);

    // MEMORISATION DES TÂCHES
    const filteredTasks = useMemo(() => {
        const query = debouncedSearch.toLowerCase();
            return tasksByDate?.filter((task) =>
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query)
            );
    }, [tasksByDate, debouncedSearch]);

    // SPINNER
    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <>
        <section 
            className={styles.sectionWrapper}>
            
            <Banner title={title} subtitle={subtitle}>
                <button 
                    className={styles.createProjectBtn}
                    type="button"
                    onClick={handleCreateProject}
                    aria-haspopup="dialog">
                        + Créer un projet
                </button>
            </Banner>
        </section>
        <section 
            className={styles.chooseDisplay}
            aria-label="Choisir le mode d'affichage">
            <button 
                type="button"
                className={`${styles.displayBtn} ${!kanban ? styles.selected : ""}`}
                onClick={()=>setKanban(false)}
                aria-pressed={!kanban}
            >
                <img 
                    src="pictures/static/coche-orange.svg"
                    alt=""
                    aria-hidden="true"/>
                <span>Liste</span>
            </button>
            <button
                type="button" 
                className={`${styles.displayBtn} ${kanban ? styles.selected : ""}`}
                onClick={()=>setKanban(true)}
                aria-pressed={kanban}
            >
                <img 
                    src="pictures/static/calendar-orange.svg"
                    alt=""
                    aria-hidden="true"/>
                <span>Kanban</span>
            </button>
        </section>

        {!kanban && (
            <>
            <section 
                className={styles.listDisplay}
                aria-labelledby="tasks-title">
                <header className={styles.header}>
                    <div className={styles.label}>
                        <h2 id="tasks-title">Mes tâches assignées</h2>
                        <span>Par ordre de priorité</span>
                    </div>
                    <div className={styles.search}>
                        <label className={styles.hiddenLabel} htmlFor="search">rechercher une tâche</label>
                        <input 
                            id="search"
                            type="text" 
                            name="search" 
                            placeholder="Rechercher une tâche"
                            onChange={(e) => setSearch(e.target.value)}
                        ></input>
                        <img 
                            src="/pictures/static/search.svg"
                            alt=""
                            aria-hidden="true"/>
                    </div>
                </header>
                {filteredTasks?.length===0 && (
                        <span className={styles.warningMessage}>
                            <img src="/pictures/static/warning-orange.svg" alt=""/>
                            <p>Vous n&apos;avez aucune tâche en cours ou à faire.</p>
                        </span> 
                    )} 
                {filteredTasks?.map((task) => (
                    <TaskStrip key={task.id} task={task} mode={"list"}/>      
                ))}
            </section>
            </>
        )}

        <section 
            className={styles.kanbanDisplay}>
            {kanban && (
                <>
                    {(tasksForKanban?.todoTasks.length===0 && tasksForKanban?.inProgressTasks.length===0 && tasksForKanban?.doneTasks.length===0) && (
                            <span className={styles.warningMessage}>
                                <img src="/pictures/static/warning-orange.svg" alt=""/>
                                <p>Vous n&apos;avez aucune tâche en cours ou à faire.</p>
                            </span> 
                    )} 
                    <section 
                        className={styles.kanbanWrapper}
                        aria-label="Tableau Kanban des tâches"
                    >
                        <KanbanColumn title={"A faire"} tasks={tasksForKanban?.todoTasks ?? []} mode={"kanban"}/>
                        <KanbanColumn title={"En cours"} tasks={tasksForKanban?.inProgressTasks ?? []} mode={"kanban"}/>
                        <KanbanColumn title={"Terminées"} tasks={tasksForKanban?.doneTasks ?? []} mode={"kanban"}/>
                    </section>
                </>
                
            )}
        </section>
                
        {createProjectForm && (
            <Modal 
                onClose={()=>setCreateProjectForm(false)}
                titleId="create-project-title">
                <Form 
                    data={data} 
                    formData={formData} 
                    setFormData={setFormData} 
                    handleSubmit={createProject} 
                    errors={errors} 
                    apiResponse={apiResponse}></Form>
            </Modal>
         )}
        {selectedTask && (
            <Modal 
                onClose={()=>removeTask()}
                titleId="task-details-title">
                <TaskCard 
                    task = {selectedTask} 
                    projectId={selectedTask.projectId!} 
                    token={token} 
                    ctaAvaliable={ctaAvaliable}/>
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
        
        </>
        
    )
}