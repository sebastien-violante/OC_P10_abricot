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

export default function Dashboard() {
    
    // Récupération du token dans les cookies
    const router = useRouter()
    const token = Cookies.get('token')
    const [user, setUser] = useState<User | null>(null)
    const [tasksByDate, setTasksByDate] = useState<Task[] | null>(null)
    const [tasksForKanban, setTasksForKanban] = useState<KanbanLists | null>(null)
    const [loading, setLoading] = useState(true)
    const [kanban, setKanban] = useState(true)
    
    useEffect (() => {
        if(!token) {
            router.push('/')
            return
        }
        console.log(token)
        const authToken = token;
        async function loadDashboard() {
            try {
                const [profile, tasks] = await Promise.all([
                    fetchProfile({ token: authToken }),
                    fetchTasks({ token: authToken }),
                ]);
                setUser(profile);
                localStorage.setItem("user", JSON.stringify(profile.user));
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

    const title="Tableau de bord"
    const subtitle=`Bonjour ${user?.name}, voici un aperçu de vors projets et tâches`
    const handleClick = () => {
        console.log('cliqué')
    }

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
            <button className={styles.displayBtn}>
                <img src="pictures/static/coche-orange.svg"/>
                Liste
            </button>
            <button className={styles.displayBtn}>
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
        

        </>
        
    )
}