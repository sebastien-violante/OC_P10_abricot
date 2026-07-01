import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
    return (
        <header>
            <Image height={20} width={147} alt="logo du site" src="/pictures/static/logo-orange.svg"/>
            <nav>
                <ul>
                    <li>
                        <Link className={styles.navLink} href="#">Tableau de bord</Link></li>
                    <li>
                        <Link className={styles.navLink} href="#">Projets</Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.idTag}>AC</div>  
        </header>
    )
}