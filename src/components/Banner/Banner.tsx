import styles from './Banner.module.css'

type BannerProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;    
}

export default function Banner({title, subtitle, children}: BannerProps) {
    const titleId = "bannière"
    return (
        <section 
            className={styles.banner}
            aria-labelledby={titleId}>
            <h1 
                className={styles.pageTitle}
                id={titleId}
            >{title}</h1>
            <p>{subtitle}</p>
            <div className={styles.buttons}>
                {children}
            </div>      
        </section>
    )
}