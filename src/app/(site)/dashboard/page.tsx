'use client'

import Cookies from "js-cookie"
import styles from './page.module.css'
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import TaskStrip from "@/components/TaskStrip/TaskStrip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Task, KanbanLists } from "@/types/types";
import fetchTasks from "@/app/utils/fetchTasks";
import fetchProfile from "@/app/utils/fetchProfile";
import filterTasksByDate from "@/app/utils/filterTasksByDate";
import filterTasksByStatus from "@/app/utils/filterTasksByStatus";
import KanbanColumn from "@/components/KanbanColumn/KanbanColumn";
import { useProfile } from '@/app/context/profileContext'
import Modal from "@/components/Modal/Modal"
import { projectSchema } from "@/types/schemas/projectSchema";

export default function Dashboard() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    const [tasksByDate, setTasksByDate] = useState<Task[] | null>(null)
    const [tasksForKanban, setTasksForKanban] = useState<KanbanLists | null>(null)
    const [loading, setLoading] = useState(true)
    const [kanban, setKanban] = useState(true)
    const { profile, setProfile } = useProfile()
    const [errors, setErrors] = useState<Record<string, string>>({});
    const title="Tableau de bord"
    const subtitle=`Bonjour ${profile?.name}, voici un aperçu de vos projets et tâches`
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignees: [] as string[]
    })
    const options = [ "Collab1", "Collab2", "Collab3", "Collab4", "Collab5"];

    useEffect (() => {
        if(!token) {
            router.push('/')
            return
        }
        const authToken = token;
        console.log(token)
        async function loadDashboard() {
            try {
                const tasks = await fetchTasks({ token: authToken })            
                const filteredTasksByDate = filterTasksByDate(tasks)
                setTasksByDate(filteredTasksByDate);
                const filteredTasksByStatus = filterTasksByStatus(tasks)
                setTasksForKanban(filteredTasksByStatus);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
       }

    loadDashboard();
    }, [token, router]);

    

    function handleClick() {
        setIsOpen(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );

        setFormData((prev) => ({
        ...prev,
        assignees: selectedValues,
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const result = projectSchema.safeParse(formData);
console.log(result)
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

        const dataToSend = {
            ...result.data,
            assignees: result.data.assignees.join(", "),
        };
        console.log(dataToSend);
    };
    
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
                <Button type={"black"} width={"xlarge"} onClick={handleClick}>+ Créer un projet</Button>
            </Banner>
        </section>
        <section className={styles.chooseDisplay}>
            <button 
                className={`styles.displayBtn ${!kanban ? styles.selected : ""}`}
                onClick={()=>setKanban(false)}
            >
                <img src="pictures/static/coche-orange.svg"/>
                Liste
            </button>
            <button 
                className={`styles.displayBtn ${kanban ? styles.selected : ""}`}
                onClick={()=>setKanban(true)}
            >
                <img src="pictures/static/calendar-orange.svg"/>
                Kanban
            </button>
        </section>
        {!kanban && (
            tasksByDate?.map((task) => (
            <div key={task.id}><TaskStrip task={task}/></div>
            ))
        )}
        {kanban && (
            <section className={styles.kanbanWrapper}>
                <KanbanColumn title={"A faire"} tasks={tasksForKanban?.todoTasks ?? []}/>
                <KanbanColumn title={"En cours"} tasks={tasksForKanban?.inProgressTasks ?? []}/>
                <KanbanColumn title={"Terminées"} tasks={tasksForKanban?.doneTasks ?? []}/>
            </section>
        )}
        
        {isOpen && (
            <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Créer un projet</h1>
                    <section className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Titre*</label>
                            <input 
                                type="text" 
                                name="title" 
                                id="title" 
                                className={styles.input}
                                onChange={handleInputChange}
                                ></input>
                                {errors.title && (
                                    <p className={styles.error}>
                                        {errors.title}
                                    </p>
                                )}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="description">Description*</label>
                            <input 
                                type="text" 
                                name="description" 
                                id="description" 
                                className={styles.input}
                                onChange={handleInputChange}
                            ></input>
                            {errors.description && (
                                <p className={styles.error}>
                                    {errors.description}
                                </p>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Contributeurs</label>
                            <select 
                                multiple 
                                value={formData.assignees}
                                onChange={handleSelectChange}>
                                {options.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                                ))}
                            </select>
                            {errors.assignees && (
                                <p className={styles.error}>
                                    {errors.assignees}
                                </p>
                            )}
                        </div>
                    </section>
                    <button type="submit">Ajouter un projet</button>
                </form>
            </Modal>
    )}
        </>
        
    )
}