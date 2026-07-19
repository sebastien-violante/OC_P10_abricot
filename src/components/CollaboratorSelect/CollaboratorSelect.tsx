import styles from './CollaboratorSelect.module.css'
import { useState } from "react";
import Cookies from "js-cookie";
import fetchUsers from '@/app/utils/fetchUsers';
import type { User } from '@/types/types';

type CollaboratorSelectProps = {
    label: string;
    value: User[];
    onChange: (value: User[]) => void;
}

export default function CollaboratorSelect({label, value, onChange}: CollaboratorSelectProps) {

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const token = Cookies.get('token');
   
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


    return (
        <div className={styles.formGroup}>

            <label>{label}</label>

            {value.map(user => (
                <span key={user.id} className={styles.tag}>
                    {user.name}

                    <button
                        type="button"
                        onClick={() => removeCollaborator(user.id)}
                    >
                        <img
                            src="/pictures/static/delete.png"
                            className={styles.delete}
                            alt="Supprimer"
                        />
                    </button>
                </span>
            ))}


            <input
                value={search}
                onChange={handleSearch}
                placeholder="Rechercher un collaborateur..."
                className={styles.input}
            />


            {suggestions.length > 0 && (
                <ul className={styles.suggestionList}>
                    {suggestions.map(user => (
                        <li
                            key={user.id}
                            onClick={() => addCollaborator(user)}
                            className={styles.suggestion}
                        >
                            {user.name} ({user.email})
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}