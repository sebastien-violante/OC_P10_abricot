'use client'

import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import getInitials from '@/app/utils/getInitials'
import { useProfile } from '@/app/context/profileContext'
import { useMemo, useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function Header() {
    const { profile, setProfile } = useProfile()
    const router = useRouter()
    const pathname = usePathname()
    const initials = useMemo(
        () => profile ? getInitials(profile.name) : '',
        [profile]
    )
    const isDashboard = pathname === '/dashboard'
    const isProjects = pathname === '/projets'

    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const userMenuRef = useRef<HTMLDivElement>(null)
    const userMenuButtonRef = useRef<HTMLButtonElement>(null)

    const logout = () => {
        Cookies.remove('token')
        setProfile(null)
        setUserMenuOpen(false)
        router.push('/')
    }

    const account = () => {
        setUserMenuOpen(false)
        router.push('/compte')
    }

    const handleClick = () => {
        setUserMenuOpen(prev => !prev)
    }

    useEffect(() => {
        if (!userMenuOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setUserMenuOpen(false)
                userMenuButtonRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [userMenuOpen])

    useEffect(() => {
        if (!userMenuOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [userMenuOpen])

    return (
        <header className={styles.header}>

            <Link
                className={styles.logoLink}
                href="/dashboard"
                aria-label="Accueil - Tableau de bord"
            >
                <Image
                    height={20}
                    width={147}
                    src="/pictures/static/logo-orange.svg"
                    alt=""
                />
            </Link>

            <nav
                className={styles.nav}
                aria-label="Navigation principale"
            >
                <ul className={styles.navUl}>

                    <li
                        className={`${styles.navLi} ${
                            isDashboard ? styles.selectedLink : ''
                        }`}
                    >
                        <Link
                            className={styles.navLink}
                            href="/dashboard"
                            aria-current={
                                isDashboard ? 'page' : undefined
                            }
                        >
                            <img
                                className={styles.navLinkIcon}
                                src={`/pictures/static/${
                                    isDashboard
                                        ? 'dashboard-white-icon.svg'
                                        : 'dashboard-icon.svg'
                                }`}
                                alt=""
                                aria-hidden="true"
                            />

                            <span className={styles.navLinkTitle}>
                                Tableau de bord
                            </span>
                        </Link>
                    </li>

                    <li
                        className={`${styles.navLi} ${
                            isProjects ? styles.selectedLink : ''
                        }`}
                    >
                        <Link
                            className={styles.navLink}
                            href="/projets"
                            aria-current={
                                isProjects ? 'page' : undefined
                            }
                        >
                            <img
                                className={styles.navLinkIcon}
                                src={`/pictures/static/${
                                    isProjects
                                        ? 'folder-white-icon.svg'
                                        : 'folder-icon.svg'
                                }`}
                                alt=""
                                aria-hidden="true"
                            />

                            <span className={styles.navLinkTitle}>
                                Projets
                            </span>
                        </Link>
                    </li>

                </ul>
            </nav>

            <div
                className={styles.userMenu}
                ref={userMenuRef}
            >
                <button
                    ref={userMenuButtonRef}
                    type="button"
                    className={`${styles.idTag} ${
                        userMenuOpen ? styles.selected : ''
                    }`}
                    onClick={handleClick}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-controls="user-menu"
                    aria-label={
                        userMenuOpen
                            ? `Fermer le menu du compte de ${profile?.name ?? ''}`
                            : `Ouvrir le menu du compte de ${profile?.name ?? ''}`
                    }
                >
                    {initials}
                </button>

                {userMenuOpen && (
                    <ul
                        id="user-menu"
                        className={styles.userMenuList}
                        aria-label="Menu du compte"
                    >
                        <li>
                            <button
                                type="button"
                                onClick={account}
                            >
                                Mon compte
                            </button>
                        </li>

                        <li>
                            <button
                                type="button"
                                onClick={logout}
                            >
                                Déconnexion
                            </button>
                        </li>
                    </ul>
                )}
            </div>

        </header>
    )
}