'use client'

import Cookies from "js-cookie"
import styles from './page.module.css'
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import TaskStrip from "@/components/TaskStrip/TaskStrip";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { User, Task, KanbanLists } from "@/types/types";
import fetchTasks from "@/app/utils/fetchTasks";
import fetchProfile from "@/app/utils/fetchProfile";
import filterTasksByDate from "@/app/utils/filterTasksByDate";
import filterTasksByStatus from "@/app/utils/filterTasksByStatus";
import KanbanColumn from "@/components/KanbanColumn/KanbanColumn";
import { useProfile } from '@/app/context/profileContext'
import Modal from "@/components/Modal/Modal"
import { projectSchema } from "@/types/schemas/projectSchema";
import Form from "@/components/Form/Form";
import recordProject from "@/app/utils/recordProject";
import type { ProjectFormData, CustomInput } from "@/types/types";
import TaskCard from "@/components/TaskCard/TaskCard";
import { useSelectedTask } from "@/store/SelectedTaskStore";

export default function Dashboard() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    const [tasksByDate, setTasksByDate] = useState<Task[] | null>(null)
    const [tasksForKanban, setTasksForKanban] = useState<KanbanLists | null>(null)
    const [loading, setLoading] = useState(true)
    const [kanban, setKanban] = useState(false)
    const { profile, setProfile } = useProfile()
    const [errors, setErrors] = useState<Record<string, string>>({});
    const title="Tableau de bord"
    const subtitle=`Bonjour ${profile?.name}, voici un aperçu de vos projets et tâches`
    // Etat fermé/ouvert des modales
    const [createProjectForm, setCreateProjectForm] = useState(false)
    //const [displayTask, setDisplayTask] = useState(false)
    const [apiResponse, setApiResponse] = useState("")
    // Objet de récupération des données de formulaire
    const [formData, setFormData] = useState<ProjectFormData>({
        formTitle: "Créer un projet",
        title: "",
        ctaLabel: "Ajouter un projet",
        description: "",
        collaborators: [] 
    })
    const selectedTask = useSelectedTask((state) => state.task)
    console.log(selectedTask)
    const removeTask = useSelectedTask((state) => state.removeTask)
    const ctaAvaliable = false
    const [search, setSearch] = useState("");

    // Objet de composition du formulaire
    const data = {
        title: "Créer un projet",
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


    useEffect (() => {
        if(!token) {
            router.push('/')
            return
        }
        async function loadDashboard(token: string) {
            try {
                const tasks = await fetchTasks({ token }) 
                console.log(tasks) 
                const user = await fetchProfile({ token })
                localStorage.setItem('user', JSON.stringify(user) )   
                const filteredTasksByDate = filterTasksByDate(tasks)
                setTasksByDate(filteredTasksByDate);
                const filteredTasksByStatus = filterTasksByStatus(tasks)
                console.log(filteredTasksByStatus)
                setTasksForKanban(filteredTasksByStatus);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard(token);
    }, [token, router]);

    
    function handleClick() {
        setCreateProjectForm(true)
    }
     
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData)
        e.preventDefault();
         if (!token) {
            router.push('/');
            return;
        }   
        // validation des données de formulaire
        const payload = {
            name: formData.title,
            description: formData.description,
            contributors: formData.collaborators.map(({ email }) => email)
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
        setApiResponse(fetchResult.message)
    };

    const filteredTasks = useMemo(() => {
        return tasksByDate?.filter((task) => (task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase()))
    
    )}, [tasksByDate, search])
    console.log(filteredTasks)
    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <>
        <section className={styles.sectionWrapper}>
            <Banner title={title} subtitle={subtitle}>
                <Button color={"black"} width={"xlarge"} onClick={handleClick}>+ Créer un projet</Button>
            </Banner>
        </section>
        <section className={styles.chooseDisplay}>
            <button 
                className={`${styles.displayBtn} ${!kanban ? styles.selected : ""}`}
                onClick={()=>setKanban(false)}
            >
                <img src="pictures/static/coche-orange.svg"/>
                Liste
            </button>
            <button 
                className={`${styles.displayBtn} ${kanban ? styles.selected : ""}`}
                onClick={()=>setKanban(true)}
            >
                <img src="pictures/static/calendar-orange.svg"/>
                Kanban
            </button>
        </section>

        {!kanban && (
            <>
            <section className={styles.listDisplay}>
                <section className={styles.header}>
                    <div className={styles.label}>
                        Mes tâches assignées
                        <span>Par ordre de priorité</span>
                    </div>
                    <div className={styles.search}>
                        <input 
                            type="text" 
                            name="search" 
                            placeholder="Rechercher une tâche"
                            onChange={(e) => setSearch(e.target.value)}
                        ></input>
                        <img src="/pictures/static/search.svg"/>
                    </div>
                </section>
                
                {filteredTasks?.map((task) => (
                <div key={task.id}><TaskStrip task={task} kanban={kanban}/></div>
                ))}
            </section>
            </>
        )}

        <section className={styles.kanbanDisplay}>
            {kanban && (
                <section className={styles.kanbanWrapper}>
                    <KanbanColumn title={"A faire"} tasks={tasksForKanban?.todoTasks ?? []} kanban={kanban}/>
                    <KanbanColumn title={"En cours"} tasks={tasksForKanban?.inProgressTasks ?? []} kanban={kanban}/>
                    <KanbanColumn title={"Terminées"} tasks={tasksForKanban?.doneTasks ?? []} kanban={kanban}/>
                </section>
            )}
        </section>
                
        {createProjectForm && (
            <Modal onClose={()=>setCreateProjectForm(false)}>
                <Form data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} errors={errors} apiResponse={apiResponse}></Form>
            </Modal>
         )}
        {selectedTask && (
            <Modal onClose={()=>removeTask()}>
                <TaskCard task = {selectedTask} projectId={selectedTask.projectId} token={token} ctaAvaliable={ctaAvaliable}/>
            </Modal>
        )}
        
        </>
        
    )
}