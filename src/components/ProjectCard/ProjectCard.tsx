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
        
            <div className={styles.ProjectCard}>
                <Link href={`/projet/${project.id}`}>
                    <article className={styles.cardWrapper}>
                        <div className={styles.titles}>
                            <h2 className={styles.cardTitle}>{project.name}</h2>
                            <p className={styles.cardSubTitle}>{project.description}</p>
                        </div>
                        <ProgressBar project={project} />
                        <Team project={project}/>
                    </article>
                </Link>
            </div>
        
    )
}