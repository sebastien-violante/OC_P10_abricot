import styles from './not-found.module.css'
import Link from 'next/link'

export default function notFound() {
    return (
        <section className={styles.notfound}>
            <div className={styles.wrapper}>
                <span className={styles.number}>404</span>
                <img className={styles.logo} src="/pictures/static/logo-orange.svg" alt="logo du site Abricot"/>
                <h1>Désolé !</h1>
                <p>Visiblement, cette page n’existe pas</p>
                <Link tabIndex={0} className={styles.link} href="/">Cliquez ici pour vous connecter</Link>
            </div>
            
        </section>
    )
}