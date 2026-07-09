import getInitials from '@/app/utils/getInitials';
import styles from './Team.module.css'
import { Project } from '@/types/types'

type TeamProps = {
    project: Project;
}

export default function Team({project}: TeamProps) {

    const memberInitials: string[] = []
    project.members.forEach((member) => { memberInitials.push(getInitials(member.user.name))})
    console.log(project)
    console.log(memberInitials)
    const ownerInitials = getInitials(project.owner.name)
    return (
        <article className={styles.teamWrapper}>
            <div className={styles.teamLabel}>
                <img src="pictures/static/union.svg"/>
                Equipe
                <span>({project.members.length})</span>
            </div>
        
            <div className={styles.teamComposition}>
                <span className={styles.ownerBadge}>{ownerInitials}</span>
                <span className={styles.ownerLabel}>Propriétaire</span>
                <div className={styles.memberBadges}>
                    {memberInitials.map((member)=> (
                        <span key={member} className={styles.memberBadge}>{member}</span>
                    ))}
                </div>
            </div>
        </article>
    )
}