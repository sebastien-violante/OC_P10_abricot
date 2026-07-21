import styles from './ProjectCard.module.css'
import { Project } from '@/types/types'
import Team from '../Team/Team'
import ProgressBar from '../ProgressBar/ProgressBar'
import Link from 'next/link'

type ProjectCardProps = {
    project: Project;
}

export default function ProjectCard({project}: ProjectCardProps) {

    return (
        <>
            <Link href={`/projet/${project.id}`}>
                <article className={styles.cardWrapper}>
                    <div className={styles.titles}>
                        <h2 className={styles.cardTitle}>{project.name}</h2>
                        <h3 className={styles.cardSubTitle}>{project.description}</h3>
                    </div>
                    <ProgressBar project={project} />
                    <Team project={project}/>
                </article>
            </Link>
            
        </>
       
        
    )
}