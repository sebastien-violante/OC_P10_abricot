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
import Button from '@/components/Button/Button';
import Banner from '@/components/Banner/Banner';
import { CustomInput } from '@/types/types';
import type { ProjectFormData, FlashMessage } from '@/types/types';
import { projectSchema } from "@/types/schemas/projectSchema";
import recordProject from '@/app/utils/recordProject';
import Modal from '@/components/Modal/Modal';
import Form from '@/components/Form/Form';
import { useProjectStore } from '@/store/ProjectStore'

export default function Projects() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    //const [projects, setProjects] = useState<Project[] | null>(null)
    const [loading, setLoading] = useState(true)
    const { profile, setProfile } = useProfile()
    const projectsInStore = useProjectStore((state) => state.projects)
    const title = "Mes projets"
    const subtitle = "Gérer mes projets"
    const [isOpen, setIsOpen] = useState(false)
    const [apiResponse, setApiResponse] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({});
    const addProjectInStore = useProjectStore((state) => state.addProject)
    const setProjectsInStore = useProjectStore((state) => state.setProjects)
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
    
    useEffect(() => {
        const flashBag = localStorage.getItem("flashBag")
        if(flashBag) {
            const parsedFlashBag = JSON.parse(flashBag);
            setFlashMessage({ status: parsedFlashBag.status, message: parsedFlashBag.message });
            setTimeout(() => {setFlashMessage(null)}, 2000);
             localStorage.removeItem("flashBag")
    }
    }, [])
   
    // Objet de récupération des données de formulaire
        const [formData, setFormData] = useState<ProjectFormData>({
            formTitle: "Créer un projet",
            title: "",
            ctaLabel: "Créer un projet",
            description: "",
            mode: true,
            collaborators: [] 
        })
    
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
    
    
    function handleClick() {
        setIsOpen(true)
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
            console.log(fetchResult)
            setApiResponse(fetchResult.message)
            if(fetchResult.success) {
                addProjectInStore({...fetchResult.data.project, tasks: []})
            }
        };
    


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
                    //setProjects(projectsWithTasks)
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
            <section className={styles.sectionWrapper}>
                <Banner title={title} subtitle={subtitle}>
                    <button 
                        className={styles.createProjectBtn}
                        type="button"
                        onClick={handleClick}
                        aria-haspopup="dialog">
                            + Créer un projet
                    </button>
                </Banner>
            </section>
            <div className={styles.projectsWrapper}>
                 { projectsInStore?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
           {isOpen && (
                <Modal titleId="createProject" onClose={()=>setIsOpen(false)}>
                    <Form data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} errors={errors} apiResponse={apiResponse}></Form>
                </Modal>
            )}
            {flashMessage && (
                <div className={`fixed top-5 right-5 rounded-lg ${flashMessage.status ? "bg-green-500" : "bg-red-500"} px-4 py-3 text-white shadow-lg`}>
                    {flashMessage.message}
                </div>
            )}
         
        </>
    )

       
      
}