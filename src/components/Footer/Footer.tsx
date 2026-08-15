import styles from './Footer.module.css'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Image height={13} width={101} src="/pictures/static/logo-black.svg" alt="Abricot"/>
            <p>Abricot 2026</p>
        </footer>
    )
}