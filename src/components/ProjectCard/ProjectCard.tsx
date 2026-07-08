import styles from './ProjectCard.module.css'
import { Project } from '@/types/types'
import Team from '../Team/Team'

type ProjectCardProps = {
    project: Project;
}

export default function ProjectCard({project}: ProjectCardProps) {
    return (
        <>
            <article className={styles.cardWrapper}>
                <div className={styles.titles}>
                    <h2 className={styles.cardTitle}>{project.name}</h2>
                    <h3 className={styles.cardSubTitle}>{project.description}</h3>
                </div>
                
                <Team />
            </article>
            
        </>
       
        
    )
}