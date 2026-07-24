'use client'

import styles from './page.module.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import fetchProjects   from "@/app/utils/fetchProjects";
import fetchProjectTasks from '@/app/utils/fetchProjectTasks';
import { Project } from "@/types/types";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import { useProfile } from '@/app/context/profileContext'
import { useProjectStore } from '@/store/projectStore';

export default function Projects() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    const [projects, setProjects] = useState<Project[] | null>(null)
    const [loading, setLoading] = useState(true)
    const { profile, setProfile } = useProfile()
    const setProjectsInStore = useProjectStore((state) => state.setProjects)
    
    useEffect (() => {
            if(!token) {
               /* router.push('/')*/
                return
            }
            const authToken = token;
            
            async function loadProjects() {
                try {
                    const userProjects = await fetchProjects({ token: authToken })
                    console.log(userProjects)
                    const projectsWithTasks = await Promise.all(
                        userProjects.map(async (project) => {
                            try {
                            const tasks = await fetchProjectTasks({
                                id: project.id,
                                token: authToken,
                            });

                            return {
                                ...project,
                                tasks,
                            };
                            } catch (error) {
                            // Le projet n'a pas de tâches (ou autre erreur à gérer)
                            return {
                                ...project,
                                tasks: [],
                            };
                            }
                        })
                    )
                    console.log(projectsWithTasks);
                    setProjects(projectsWithTasks)
                    setProjectsInStore(projectsWithTasks)
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
           }
    
        loadProjects();
        }, [token]);


    return (
        <>
            <div className={styles.projectsWrapper}>
                 { projects?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
           
         
        </>
    )

       
      
}