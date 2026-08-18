'use client'

import styles from './page.module.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import fetchProjects   from "@/app/utils/fetchProjects";
import fetchProjectTasks from '@/app/utils/fetchProjectTasks';
import { Project } from "@/types/types";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import Banner from '@/components/Banner/Banner';
import { CustomInput } from '@/types/types';
import type { ProjectFormData, FlashMessage } from '@/types/types';
import { projectSchema } from "@/types/schemas/projectSchema";
import Modal from '@/components/Modal/Modal';
import Form from '@/components/Form/Form';
import postRequest from '@/app/utils/postRequest';
import { useProjectStore } from '@/store/ProjectStore'

export default function Projects() {
    
    const router = useRouter()
    const token = Cookies.get('token')
    const [loading, setLoading] = useState(true)
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
            name: "",
            ctaLabel: "Créer un projet",
            description: "",
            mode: true,
            contributors: [] 
        })
    
        // Objet de composition du formulaire
        const data = {
            title: "Créer un projet",
            inputs : [
                {
                    label : "Titre", 
                    type : "text", 
                    name : "name", 
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
                    name: "contributors", 
                    required: true
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
    

    useEffect (() => {
            if(!token) {
               router.push('/')
               return
            }
            const authToken = token;
            
            async function loadProjects() {
                try {
                    
                    const userProjects = await fetchProjects({ token: authToken })
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
                    setProjectsInStore(projectsWithTasks)
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