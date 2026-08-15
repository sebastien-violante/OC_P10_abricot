/*

import styles from './Form.module.css'
import CollaboratorSelect from '../CollaboratorSelect/CollaboratorSelect'
import StatusSelect from '../StatusSelect/StatusSelect'
import type { CustomInput } from '@/types/types'
import type { User } from '@/types/types'

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
            noValidate
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
            <button type="submit" className={styles.submitBtn}>{formData.ctaLabel}</button>
        </form>
            
    )
}
*/
import styles from './Form.module.css'
import CollaboratorSelect from '../CollaboratorSelect/CollaboratorSelect'
import StatusSelect from '../StatusSelect/StatusSelect'
import type { CustomInput } from '@/types/types'
import type { User } from '@/types/types'

type FormProps<T extends Record<string, any>> = {
    data: {
        title: string;
        inputs: CustomInput[];
    };
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    handleSubmit: (
        e: React.FormEvent<HTMLFormElement>,
        taskId: string
    ) => void;
    errors: Record<string, string>;
    apiResponse?: string;
};

export default function Form<T extends Record<string, any>>({
    data,
    formData,
    setFormData,
    handleSubmit,
    errors,
    apiResponse
}: FormProps<T>) {

    return (
        <form
            className={styles.form}
            onSubmit={(e) => handleSubmit(e, formData.taskId)}
            noValidate
        >
            <h2 className={styles.title}>
                {formData.formTitle}
            </h2>

            {Object.values(errors).length > 0 && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className={styles.errorSummary}
                >
                    <p>
                        Le formulaire contient des erreurs.
                    </p>

                    <ul>
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {apiResponse && (
                <p
                    className={styles.apiResponse}
                    role="status"
                    aria-live="polite"
                >
                    {apiResponse}
                </p>
            )}

            <div className={styles.formContainer}>
                {data.inputs
                    .filter(
                        input =>
                            input.type !== "status" ||
                            formData.edit
                    )
                    .map((input) => {

                        const inputId = `field-${input.name}`;
                        const errorId = `${inputId}-error`;
                        const error = errors[input.name];

                        switch (input.type) {

                            case "text":
                                return (
                                    <div
                                        key={input.name}
                                        className={styles.formGroup}
                                    >
                                        <label htmlFor={inputId}>
                                            {input.label}
                                            {input.required && (
                                                <span aria-hidden="true">
                                                    {' *'}
                                                </span>
                                            )}

                                            {input.required && (
                                                <span className={styles.srOnly}>
                                                    {' '}
                                                </span>
                                            )}
                                        </label>

                                        <input
                                            id={inputId}
                                            name={input.name}
                                            type="text"
                                            className={styles.input}
                                            value={
                                                (formData[input.name] as string) ?? ""
                                            }
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    [input.name]: e.target.value
                                                }))
                                            }}
                                            required={input.required}
                                            aria-invalid={error ? "true" : "false"}
                                            aria-describedby={
                                                error ? errorId : undefined
                                            }
                                        />

                                        {error && (
                                            <p
                                                id={errorId}
                                                className={styles.error}
                                            >
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                );

                            case "date":
                                return (
                                    <div
                                        key={input.name}
                                        className={styles.formGroup}
                                    >
                                        <label htmlFor={inputId}>
                                            {input.label}
                                            {input.required && (
                                                <span aria-hidden="true">
                                                    {' *'}
                                                </span>
                                            )}
                                        </label>

                                        <div className={styles.dateInputWrapper}>
                                            <input
                                                id={inputId}
                                                name={input.name}
                                                type="date"
                                                className={styles.dateInput}
                                                value={
                                                    (formData[input.name] as string) ?? ""
                                                }
                                                onChange={(e) =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        [input.name]: e.target.value
                                                    }))
                                                }
                                                required={input.required}
                                                aria-invalid={
                                                    error ? "true" : "false"
                                                }
                                                aria-describedby={
                                                    error ? errorId : undefined
                                                }
                                            />
                                        </div>

                                        {error && (
                                            <p
                                                id={errorId}
                                                className={styles.error}
                                            >
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                );

                            case "collaborators":
                                return (
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
                                );

                            case "status":
                                return (
                                    <StatusSelect
                                        key={input.name}
                                        label={input.label}
                                        value={formData[input.name] as string}
                                        options={[
                                            "À faire",
                                            "En cours",
                                            "Terminée"
                                        ]}
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
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
            >
                {formData.ctaLabel}
            </button>
        </form>
    )
}