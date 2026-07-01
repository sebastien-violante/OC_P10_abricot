import styles from './Footer.module.css'
import Image from 'next/image'

export default function Footer() {
    return (
        <div className={styles.footer}>
            <Image height={13} width={101} src="/pictures/static/logo-black.svg" alt="logo Abricot"/>
            <p>Abricot 2026</p>
        </div>
    )
}