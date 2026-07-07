'use client'

import Cookies from "js-cookie"
import styles from './page.module.css'
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import TaskStrip from "@/components/TaskStrip/TaskStrip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Task } from "@/types/types";
import fetchTasks from "@/app/utils/fetchTasks";
import fetchProfile from "@/app/utils/fetchProfile";

export default function Dashboard() {
    
    // Récupération du token dans les cookies
    const router = useRouter()
    const token = Cookies.get('token');
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[] | null>(null)
    const [loading, setLoading] = useState(true);
    
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
                setTasks(tasks);
                console.log(tasks)
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
        <div className={styles.sectionWrapper}>
            <Banner title={title} subtitle={subtitle}>
                <Button type={"black"} width={"xlarge"} onClick={handleClick}>+ Créer un projet</Button>
            </Banner>
        </div>
        
        {tasks?.map((task) => (
            <div key={task.id}><TaskStrip task={task}/></div>
            ))   
        } 

        </>
        
    )
}