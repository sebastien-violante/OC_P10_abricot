'use client'

import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import getInitials from '@/app/utils/getInitials'
import { useProfile } from '@/app/context/profileContext'
import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {

    const { profile, setProfile } = useProfile()
    const router = useRouter();
    const initials = useMemo(
        () => profile ? getInitials(profile.name) : '',
        [profile]
    )
    const pathname = usePathname()
    const isDashboard = pathname === "/dashboard"
    const isProjects = pathname === '/projets'
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    function logout() {
        Cookies.remove("token");
        setProfile(null);
        router.push("/");
    }

    function account() {
        router.push("/compte");
    }

    const handleClick = () => {
        setUserMenuOpen(prev => !prev)
        // Fermuture du menu au bout de 10 secondes
        setTimeout(() => {
            setUserMenuOpen(false)
        }, 10000);
    }

    return (
        <header className={styles.header}>
            <button onClick={logout}>
                <Image height={20} width={147} alt="logo du site" src="/pictures/static/logo-orange.svg"/>
            </button>
            <nav>
                <ul className={styles.navUl}>
                    <li className={`${styles.navLi} ${isDashboard ? styles.selectedLink : ""}`}>
                        <Link  className={styles.navLink} href="/dashboard">
                            <img className={styles.navLinkIcon} src={`/pictures/static/${isDashboard ? "dashboard-white-icon.svg" : "dashboard-icon.svg"}`}/>
                            <span className={styles.navLinkTitle}>Tableau de bord</span>
                        </Link>
                    </li>
                    <li className={`{styles.navLi} ${styles.navLi} ${isProjects ? styles.selectedLink : ""}`}>
                        <Link className={styles.navLink} href="/projets">
                            <img className={styles.navLinkIcon} src={`/pictures/static/${isProjects ? "folder-white-icon.svg" : "folder-icon.svg"}`}/>
                            <span className={styles.navLinkTitle}>Projets</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.userMenu}>
                <button className={`${styles.idTag} ${userMenuOpen ? styles.selected : ""}`} onClick={handleClick}>{initials}</button>  
                { userMenuOpen && <ul>
                    <li onClick={account}>Mon compte</li>
                    <li onClick={logout}>Déconnexion</li>
                </ul>
                }
            </div>
        </header>
    )
}