import styles from './CollaboratorSelect.module.css'
import { useState } from "react";
import Cookies from "js-cookie"
import fetchUsers from '@/app/utils/fetchUsers';

export default function CollaboratorSelect({input, collaborators, setFormData}) {

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const token = Cookies.get('token')

    async function handleSearch(e) {

        const value = e.target.value;
        console.log(value)
        setSearch(value);

        if (value.length < 2) {
            setSuggestions([]);
            return;
        }
        if(value.length >=2) {
            const users = await fetchUsers({token ,value})
       
        console.log(users)
        setSuggestions(users);
        }
        

    }

    function addCollaborator(user) {

        setFormData(prev => {
            if (prev.collaborators.some(c => c.id === user.id))
                return prev;
            return {
                ...prev,
                collaborators: [
                    ...prev.collaborators,
                    user
                ]
            };

        });

        setSearch("");
        setSuggestions([]);

    }

    function removeCollaborator(id) {

        setFormData(prev => ({
            ...prev,
            collaborators:
                prev.collaborators.filter(c => c.id !== id)
        }));

    }

    return (

        <div>

            <label>{input.label}</label>
            {collaborators.map(user => (

                <span key={user.id}>
                    {user.name}

                    <button
                        type="button"
                        onClick={() => removeCollaborator(user.id)}
                    >
                        ×
                    </button>

                </span>

            ))}

            <input
                value={search}
                onChange={handleSearch}
                placeholder="Rechercher un collaborateur..."
            />

            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map(user => (
                        <li
                            key={user.id}
                            onClick={() => addCollaborator(user)}
                        >
                            {user.name} ({user.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}
