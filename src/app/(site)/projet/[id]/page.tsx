import styles from './page.module.css'
import Banner from '@/components/Banner/Banner'
import Button from '@/components/Button/Button'

export default function Login() {

    const title = "Nom du projet"
    const subtitle = "a définir"

    const handleClick = () => {
        console.log('cliqué')
    }
    return (
        <div className={styles.sectionWrapper}>
            <Banner title={title} subtitle={subtitle}>
                <Button type={"black"} width={"xlarge"} onClick={handleClick}>+ Créer un projet</Button>
            </Banner>
        </div>
    )
}