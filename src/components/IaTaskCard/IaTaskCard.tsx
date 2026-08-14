import { TaskIa } from '@/types/types'
import styles from './IaTaskCard.module.css'
import { useState } from 'react';

type IaTaskCardProps = {
    task: TaskIa;
    onChange: (changes: Partial<TaskIa>) => void
    onDelete: () => void
}

export default function IaTaskCard({task, onChange, onDelete}: IaTaskCardProps) {

    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <div className={styles.iaCardContainer}>

            <section className={styles.header}>

                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={task.title}
                            onChange={(event) =>
                                onChange({
                                    title: event.target.value,
                                })
                            }
                        />

                        <textarea
                            value={task.description}
                            onChange={(event) =>
                                onChange({
                                    description: event.target.value,
                                })
                            }
                        />
                    </>
                ) : (
                    <>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                    </>
                )}

            </section>

            <section className={styles.cta}>

                <button
                    type="button"
                    className={styles.ctaButton}
                    onClick={onDelete}
                >
                    <img
                        alt=""
                        src="/pictures/static/grey-bin.svg"
                        aria-hidden="true"
                    />

                    <span>Supprimer</span>
                </button>

                <button
                    type="button"
                    className={styles.ctaButton}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <img
                        alt=""
                        src="/pictures/static/pen.svg"
                        aria-hidden="true"
                    />

                    <span>
                        {isEditing ? "Terminer" : "Modifier"}
                    </span>
                </button>

            </section>

        </div>
    )
}