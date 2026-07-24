import styles from './Form.module.css'
import CollaboratorSelect from '../CollaboratorSelect/CollaboratorSelect'
import StatusSelect from '../StatusSelect/StatusSelect'
import type { CustomInput } from '@/types/types'
import type { ProjectFormData, User } from '@/types/types'

type FormProps<T extends Record<string, any>> = {
    data: {
        title: string;
        inputs: CustomInput[];
    };
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    errors: Record<string, string>;
    apiResponse: string;
};

export default function Form<T extends Record<string, any>>({data, formData, setFormData, handleSubmit, errors, apiResponse}: FormProps<T>) {
    return (
        <form 
            className={styles.form} 
            onSubmit={handleSubmit}
        >
            <h2 className={styles.title}>{data.title}</h2> 
           {Object.values(errors).map((error, index) => (
            <p key={index} className="text-red-500">
                {error}
            </p>
            ))}
            {apiResponse}
            <section className={styles.formContainer}>
                {data.inputs.map((input) => {
                    switch (input.type) {
                        case "text": return (
                            <div key={input.label} className={styles.formGroup}>
                                <label>{input.label}{input.required && '*'}</label>
                                <input
                                    type={input.type}
                                    className={styles.input}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            [input.name]: e.target.value
                                        }))
                                    }
                                />
                            </div>)
                        
                        case "date": return (
                            <div key={input.label} className={styles.formGroup}>
                                <label>{input.label}</label>
                                <input
                                    type="date"
                                    value={formData[input.name] as string}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            [input.name]: e.target.value
                                        }))
                                    }
                                />
                            </div>
                            )
                       
                        case "collaborators": return (
                             <CollaboratorSelect
                                key={input.name}
                                label={input.label}
                                value={formData[input.name] as User[]}
                                onChange={(value) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        [input.name]: value
                                    }))
                                }
                            />
                        )
                        case "status":
                            return (
                                <StatusSelect
                                    key={input.name}
                                    label={input.label}
                                    value={formData[input.name] as string}
                                    options={["À faire", "En cours", "Terminée"]}
                                    onChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            [input.name]: value
                                        }))
                                    }
                                />
                            );
                    }
                })}
            </section>
            <button type="submit">Ajouter un projet</button>
        </form>
            
    )
}