'use client'

import styles from './page.module.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import type { Project, ProjectFormData, FlashMessage, GetProjectsData, GetTasksData, CustomInput } from '@/types/types';

import getRequest from '@/app/utils/getRequest';
import postRequest from '@/app/utils/postRequest';

import { useProjectStore } from '@/store/ProjectStore'

import ProjectCard from "@/components/ProjectCard/ProjectCard";
import Banner from '@/components/Banner/Banner';
import Modal from '@/components/Modal/Modal';
import Form from '@/components/Form/Form';

import { projectSchema } from "@/types/schemas/projectSchema";

export default function Projects() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    const title = "Mes projets"
    const subtitle = "Gérer mes projets"

    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [apiResponse, setApiResponse] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
    
    const projectsInStore = useProjectStore((state) => state.projects)
    const addProjectInStore = useProjectStore((state) => state.addProject)
    const setProjectsInStore = useProjectStore((state) => state.setProjects)
    
    // Chargement d'un message flash : nécessaire après suppression d'un projet sur la page projet/id et retour sur la page /projets
    useEffect(() => {
    const flashBag = localStorage.getItem("flashBag")
    if(flashBag) {
        const parsedFlashBag = JSON.parse(flashBag);
        setFlashMessage({ status: parsedFlashBag.status, message: parsedFlashBag.message });
        setTimeout(() => {setFlashMessage(null)}, 2000);
            localStorage.removeItem("flashBag")
    }
    }, [])
   
    // DONNEES DE FORMULAIRE
    const [formData, setFormData] = useState<ProjectFormData>({
        formTitle: "Créer un projet",
        name: "",
        ctaLabel: "Créer un projet",
        description: "",
        mode: true,
        contributors: [] 
    })
            
    const data = {
        title: "Créer un projet",
        inputs : [
            {label : "Titre", type : "text", name : "name", required: true},
            {label : "Description", type: "text", name : "description", required: true},
            {label : "Contributeurs", type: "collaborators", name: "contributors", required: true}
        ],
    } satisfies {
        title: string;
        inputs: CustomInput[];
    };
    
    
    function handleCreateProject() {
        setIsOpen(true)
    }

    async function createProject(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
            if (!token) {
            router.push('/');
            return;
        }   
        // Création de la payload
        const payload = {
            name: formData.name,
            description: formData.description,
            contributors: formData.contributors.map(({ email }) => email)
            };
        
        // Validation Zod
        const zodValidation = projectSchema.safeParse(payload);
        if (!zodValidation.success) {
            const formattedErrors: Record<string, string> = {};
            zodValidation.error.issues.forEach((error) => {
                const field = error.path[0];
                formattedErrors[field as string] = error.message;
            });
            setErrors(formattedErrors);
            return;
        }
        setErrors({});

        try {
            const url = "api/projects"
            const result = await postRequest<typeof payload,{ project: Project }>({ url, token, payload })
            addProjectInStore(result.data!.project)
            setIsOpen(false)
            setFlashMessage({ status: true, message: "Le nouveau projet est enregistré", }) 
            setTimeout(() => {setFlashMessage(null)}, 2000);
        } catch(error) {
            const message = error instanceof Error ? error.message : "Une erreur est survenue";
            setFlashMessage({ status: false, message: message }) 
            setTimeout(() => {setFlashMessage(null)}, 2000);
        } 
    }
    
    // DEBOUNCE
    useEffect (() => {
            if(!token) {
               router.push('/')
               return
            }
                        
            async function loadProjects() {
                try {
                    const url="/api/projects"
                    const result =  await getRequest<GetProjectsData>({url, token})
                    const projects = result.data?.projects
                    if(projects) {
                        const projectsWithTasks = await Promise.all(
                        projects.map(async (project) => {
                            try {
                                const url = `/api/projects/${project.id}/tasks`
                                const result = await getRequest<GetTasksData>({url, token})
                                const tasks = result.data?.tasks
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
                    setProjectsInStore(projectsWithTasks)
                    }                    
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
           }
    
        loadProjects();
        }, [token]);

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
            </div>
        )
    }
    
    return (
        <>
            <section className={styles.sectionWrapper}>
                <Banner title={title} subtitle={subtitle}>
                    <button 
                        className={styles.createProjectBtn}
                        type="button"
                        onClick={handleCreateProject}
                        aria-haspopup="dialog">
                            + Créer un projet
                    </button>
                </Banner>
            </section>
            <div className={styles.projectsWrapper}>
                {projectsInStore?.length===0 && (
                        <span className={styles.warningMessage}>
                            <img src="/pictures/static/warning-orange.svg" alt=""/>
                            <p>Vous n&apos;avez pas encore de projet. Créez-en un en cliquant sur le bouton &quot;+ Créer un projet&quot;</p>
                        </span> 
                )} 
                 { projectsInStore?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
           {isOpen && (
                <Modal titleId="createProject" onClose={()=>setIsOpen(false)}>
                    <Form data={data} formData={formData} setFormData={setFormData} handleSubmit={createProject} errors={errors} apiResponse={apiResponse}></Form>
                </Modal>
            )}
            {flashMessage && (
                <div 
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg ${flashMessage.status ? "bg-green-500" : "bg-red-500"} px-6 py-4 text-white shadow-lg`}
                    role={ flashMessage.status ? 'status' : 'alert' } 
                    aria-live={ flashMessage.status ? 'polite' : 'assertive' }
                >
                    {flashMessage.message}
                </div>
            )}
         
        </>
    )

       
      
}