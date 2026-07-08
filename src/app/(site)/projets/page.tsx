'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import fetchProjects   from "@/app/utils/fetchProjects";
import { Project } from "@/types/types";

export default function Projects() {
    
    const router = useRouter()
    const token = Cookies.get('token')
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
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
           }
    
        loadProjects();
        }, [token, router]);


    return (
        <p>Projets</p>
    )
}