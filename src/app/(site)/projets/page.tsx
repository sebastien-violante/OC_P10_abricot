'use client'

import styles from './page.module.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import fetchProjects   from "@/app/utils/fetchProjects";
import { Project } from "@/types/types";
import ProjectCard from "@/components/ProjectCard/ProjectCard";

export default function Projects() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    console.log(token)
    const [projects, setProjects] = useState<Project[] | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect (() => {
            if(!token) {
                router.push('/')
                return
            }

            const authToken = token;
            async function loadProjects() {
                try {
                    const projects = await fetchProjects({ token: authToken })
                    setProjects(projects)
                    console.log(projects)
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
           }
    
        loadProjects();
        }, [token, router]);


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