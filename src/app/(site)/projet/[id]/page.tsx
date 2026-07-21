'use client'

import styles from './page.module.css'
import fetchProject from '@/app/utils/fetchProject'
import Cookies from "js-cookie"
import { useEffect, useState } from 'react'
import type { Task } from '@/types/types'
import TaskCard from '@/components/TaskCard/TaskCard'
import Link from 'next/link'
import Button from '@/components/Button/Button'

type SingleProjectProps = {
    params: Promise<{ id: string }>;
}

export default function SingleProject({params} : SingleProjectProps) {
    
    const token = Cookies.get('token')
    const [tasks, setTasks] = useState<Task[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [projectName, setProjectName] = useState<string | null>(null)
    console.log(token)

    function handleClick() {
        console.log('créer une tâche')
    }

    if (!token) {
        throw new Error("Token manquant");
    }

    useEffect (() => {
            
            async function loadTasks(token: string) {
                const { id } = await params;
                try {
                    const tasks = await fetchProject({id, token})
                    setTasks(tasks)
                    console.log(tasks)
                    setProjectName(tasks[0].project.name)
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
                    {projectName}
                </div>
                <div className={styles.buttons}>
                    <Button type={"black"} width={"mediumplus"} onClick={handleClick}>Créer une tâche</Button>
                    <Button type={"orange"} width={"small"} onClick={handleClick}>IA</Button>
                </div>
            </section>
                
            {tasks?.map((task)=>(
                <TaskCard key={task.id} task = {task}/>
            ))}
        </div>
    )
}