'use client'

import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import getInitials from '@/app/utils/getInitials'
import { useProfile } from '@/app/context/profileContext'
import { useMemo } from 'react'

export default function Header() {

    const { profile } = useProfile()
    const initials = useMemo(
        () => profile ? getInitials(profile.name) : '',
        [profile]
    )
    

    return (
        <header className={styles.header}>
            <Image height={20} width={147} alt="logo du site" src="/pictures/static/logo-orange.svg"/>
            <nav>
                <ul className={styles.navUl}>
                    <li className={styles.navLi}>
                        <Link  className={styles.navLink} href="#">
                            <img className={styles.navLinkIcon} src="/pictures/static/dashboard-icon.svg"/>
                            <span className={styles.navLinkTitle}>Tableau de bord</span>
                        </Link>
                    </li>
                    <li className={styles.navLi}>
                        <Link className={styles.navLink} href="#">
                            <img className={styles.navLinkIcon} src="/pictures/static/folder-icon.svg"/>
                            <span className={styles.navLinkTitle}>Projets</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.idTag}>{initials}</div>  
        </header>
    )
}