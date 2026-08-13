import styles from './Form.module.css'
import CollaboratorSelect from '../CollaboratorSelect/CollaboratorSelect'
import StatusSelect from '../StatusSelect/StatusSelect'
import type { CustomInput } from '@/types/types'
import type { User } from '@/types/types'
import Button from '../Button/Button'

type FormProps<T extends Record<string, any>> = {
    data: {
        title: string;
        inputs: CustomInput[];
    };
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>, taskId: string) => void;
    errors: Record<string, string>;
    apiResponse?: string;
};

export default function Form<T extends Record<string, any>>({data, formData, setFormData, handleSubmit, errors, apiResponse}: FormProps<T>) {
    return (
        <form 
            className={styles.form} 
            onSubmit={(e) => handleSubmit(e, formData.taskId)}
        >
            <h2 className={styles.title}>{formData.formTitle}</h2> 
           {Object.values(errors).map((error, index) => (
            <p key={index} className="text-red-500">
                {error}
            </p>
            ))}
            <span className={styles.apiResponse}>{apiResponse}</span>
            <section className={styles.formContainer}>
                {data.inputs
                .filter(input => input.type !== "status" || formData.edit)
                .map((input) => {
                    switch (input.type) {
                        case "text": return (
                            <div key={input.name} className={styles.formGroup}>
                                <label>{input.label}{input.required && '*'}</label>
                                <input
                                    name={formData[input.name]}
                                    type="text"
                                    className={styles.input}
                                    value={formData[input.name] as string ?? ""}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            [input.name]: e.target.value
                                        }))
                                    }
                                    }
                                        
                                />
                            </div>)
                        
                        case "date": return (
                            <div key={input.name} className={styles.formGroup}>
                                <label>{input.label}{input.required && '*'}</label>
                                 <div className={styles.dateInputWrapper}>
                                    <input
                                        type="date"
                                        className={styles.dateInput}
                                        value={formData[input.name] as string ?? ""}
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                [input.name]: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            )
                       
                        case "collaborators": return (
                             <CollaboratorSelect
                                key={input.name}
                                label={input.label}
                                value={formData[input.name] as User[]}
                                mode={formData.mode}
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
            <Button type="submit" color={"grey"} width={"xxlarge"}>{formData.ctaLabel}</Button>
        </form>
            
    )
}