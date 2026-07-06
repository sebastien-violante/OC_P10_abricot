import styles from './Banner.module.css'
import Button from '../Button/Button'

type BannerProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    link?: {
        label: string;
        href: string;
    };
}
const handleClick = () => {
    console.log('enfin !')
}

export default function Banner({title, subtitle, children}: BannerProps) {
    return (
        <section className={styles.banner}>
            <h1 className={styles.pageTitle}>{title}</h1>
            <p>{subtitle}</p>
            <section className={styles.buttons}>
                {children}
            </section>      
        </section>
    )
}