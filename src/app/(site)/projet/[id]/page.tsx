'use client'

import styles from './page.module.css'
import fetchProject from '@/app/utils/fetchProject'
import Cookies from "js-cookie"
import { useEffect, useState } from 'react'
import type { Task, CustomInput, TaskFormData } from '@/types/types'
import TaskCard from '@/components/TaskCard/TaskCard'
import Modal from '@/components/Modal/Modal'
import Form from '@/components/Form/Form'
import Button from '@/components/Button/Button'
import { useProjectStore } from '@/store/ProjectStore'
import { useTaskStore } from '@/store/TaskStore'

import { useParams } from 'next/navigation'
import { taskSchema } from '@/types/schemas/taskSchema'
import recordTask from '@/app/utils/recordTask'

export default function SingleProject() {
    const params = useParams<{ id: string }>()
    const projectId = params.id

    const project = useProjectStore((state) =>
        state.projects.find((p) => p.id === projectId)
    )
    const token = Cookies.get('token')
  
    //const [tasks, setTasks] = useState<Task[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiResponse, setApiResponse] = useState<string>("");
    //const [tasksInStore, setTasksInStore] = useState<Task[] | null>(null)
    const tasksInStore = useTaskStore((state) => state.tasks)
    const setTasksInStore = useTaskStore((state) => state.setTasks)
    const addTaskInStore = useTaskStore((state) => state.addTask);
    const [isOpen, setIsOpen] = useState(false)

    function handleClick() {
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData)
        e.preventDefault();
        if (!token) {
        setApiResponse("Vous devez être connecté.");
        return;
    }
        // Création de la payload en fonction du formData
         const payload = {
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            assigneeIds: formData.collaborators.map(({ id }) => id),
            status: formData.status
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
                
            const response = await recordTask({payload, token, projectId})
            const fetchResult = await response.json()
            const newTask = fetchResult.data.task
            setApiResponse(fetchResult.message)
            addTaskInStore(newTask)
    }

    // Objet de récupération des données de formulaire
    const [formData, setFormData] = useState<TaskFormData>({
        title: "",
        description: "",
        collaborators: [],
        dueDate: "",
        status: ""
    })
    
    const data = {
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
                        <span className={styles.modifyProject}>Modifier</span>
                    </div>
                    {project?.name}
                </div>
                <div className={styles.buttons}>
                    <Button type={"black"} width={"mediumplus"} onClick={handleClick}>Créer une tâche</Button>
                    <Button type={"orange"} width={"small"} onClick={handleClick}>IA</Button>
                </div>
            </section>
            <section className={styles.contributors}>
                <div className={styles.totalContributors}>
                    Contributeurs {project?.members.length}
                </div>
                <div className={styles.detailsContributors}>
                    {project?.members.map((member)=>(
                        <p key={member.id}>{member.user.name}</p>
                    ))}
                </div>
            </section>
            {tasksInStore?.length===0 && (<p>Le projet ne comporte pas encore de tâches. Créez-en une en cliquant sur le bouton &quot;Créer une tâche&quot;</p>)}  
            {tasksInStore?.map((task)=>(
                <TaskCard key={task.id} task = {task}/>
            ))}
            {isOpen && (
                        <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
                            <Form data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} errors={errors} apiResponse={apiResponse} ></Form>
                        </Modal>
                     )}
        </div>
    )
}