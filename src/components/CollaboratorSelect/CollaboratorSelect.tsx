import styles from './CollaboratorSelect.module.css'
import { useState } from "react";
import Cookies from "js-cookie";
import { GetUsersData, type User } from '@/types/types';
import getRequest from '@/app/utils/getRequest';

type CollaboratorSelectProps = {
    label: string;
    value: User[];
    mode: boolean;
    onChange: (value: User[]) => void;
    required: boolean;
}

export default function CollaboratorSelect({label, value, mode, onChange, required}: CollaboratorSelectProps) {
    
    const token = Cookies.get('token');
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [chooseMode] = useState(mode)
    const [showList, setShowList] = useState(false)

    
    async function searchCollaborators(e: React.ChangeEvent<HTMLInputElement>) {
        
        const searchValue = e.target.value;
        setSearch(searchValue);
        if (searchValue.length < 2) {
            setSuggestions([]);
            return;
        }
        if (token) {
            try {
                const url = `/api/users/search?query=${searchValue}`
                const result = await getRequest<GetUsersData>({url, token})
                const users = result.data?.users
                if(users) setSuggestions(users);
            } catch(error) {
                console.error(error)
            }
        } 
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
            <label htmlFor='collaborator-search'>
                {label}
                {required && (
                    <span aria-hidden="true">{' *'}</span>
                )}
            </label>
            {/* Dans ce mode, on peut sélectionner les collaborateurs */}
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
                    onChange={searchCollaborators}
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
            {/* Dans ce mode, on ne peut pas sélectionner les collaborateurs et on affiche seulement leur liste */}
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