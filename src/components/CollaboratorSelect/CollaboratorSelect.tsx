import styles from './CollaboratorSelect.module.css'
import { useState } from "react";
import Cookies from "js-cookie";
import fetchUsers from '@/app/utils/fetchUsers';
import type { User } from '@/types/types';

type CollaboratorSelectProps = {
    label: string;
    value: User[];
    mode: boolean;
    onChange: (value: User[]) => void;
}

export default function CollaboratorSelect({label, value, mode, onChange}: CollaboratorSelectProps) {
    console.log(mode)
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const token = Cookies.get('token');
    const [chooseMode] = useState(mode)
    const [showList, setShowList] = useState(false)

    async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const searchValue = e.target.value;

        setSearch(searchValue);

        if (searchValue.length < 2) {
            setSuggestions([]);
            return;
        }

        if (!token) return;

        const users = await fetchUsers({
            token,
            value: searchValue
        });

        setSuggestions(users);
    }


    function addCollaborator(user: User) {

        if (value.some(c => c.id === user.id)) {
            return;
        }

        onChange([
            ...value,
            user
        ]);

        setSearch("");
        setSuggestions([]);
    }


    function removeCollaborator(id: string) {

        onChange(
            value.filter(c => c.id !== id)
        );

    }

    function toggleCollaboratorsList() {
        setShowList(prev => !prev)
    }

    return (
        <div className={styles.formGroup}>
            <label htmlFor='collaborator-search'>{label}</label>
            { chooseMode && (
                <>
                {value.map(user => (
                    <span key={user.id} className={styles.tag}>
                        {user.name}
                        <button
                            type="button"
                            onClick={() => removeCollaborator(user.id)}
                            aria-label={`Supprimer ${user.name}`}
                        >
                            <img
                                src="/pictures/static/delete.png"
                                className={styles.delete}
                                alt="Supprimer"
                                aria-hidden="true"
                            />
                        </button>
                    </span>
                ))}
                <input
                    id="collaborator-search"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Rechercher un collaborateur..."
                    className={styles.input}
                />
                <div
                    aria-live="polite"
                    className={styles.srOnly}
                >
                    {suggestions.length > 0
                        ? `${suggestions.length} résultat${suggestions.length > 1 ? "s" : ""}`
                        : "Aucun collaborateur trouvé"
                    }
                </div>
                {suggestions.length > 0 && (
                    <ul className={styles.suggestionList}>
                        {suggestions.map(user => (
                            <li key={user.id}>
                                <button
                                    onClick={() => addCollaborator(user)}
                                    className={styles.suggestion}
                                >
                                    {user.name} ({user.email})
                                </button>
                            </li>
                        ))}
                    </ul>
                )} 
                </>
            )}
            { !chooseMode && (
                <div className={styles.contributorsList}>
                    <button
                        type="button" 
                        className={`${styles.input} ${styles.contributorsInput}`} 
                        onClick={toggleCollaboratorsList}
                        aria-expanded={showList}
                        aria-controls="contributors-list"
                    >
                        <span>
                            {value.length} collaborateur{value.length === 1 ? "" : "s"}
                        </span>
                        <img 
                            className={`${styles.chevron} ${showList ? styles.rotate : ""}`} 
                            src="/pictures/static/chevron.svg" 
                            alt="" 
                            aria-hidden="true"
                        />
                    </button>
                { showList && (
                    <ul id="contributors-list">
                        {value.map(user => (
                            <li key={user.id} className={styles.tag}>
                                {user.name}
                            </li>
                        ))}
                    </ul>
                )}
                </div>
            )}
            
        </div>
    );
}