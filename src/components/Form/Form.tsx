import styles from './Form.module.css'
import CollaboratorSelect from '../CollaboratorSelect/CollaboratorSelect'
export default function Form({data, formData, setFormData}) {

    return (
        <form 
            className={styles.form} 
        >
            <h2 className={styles.title}>{data.title}</h2> 
            <section className={styles.formContainer}>
                {data.inputs.map((input) => {
                    if(input.type === "select") {
                        return (
                            <CollaboratorSelect
                                key={input.name}
                                input={input}
                                collaborators={formData.collaborators}
                                setFormData={setFormData}
                            />
                        )
                    }
                    return (
                        <div key={input.label}>
                            <label>{input.label}</label>
                            <input
                                type={input.type}
                                value={formData[input.name]}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        [input.name]: e.target.value
                                    }))
                                }
                            />
                        </div>
                    )
                })}
            </section>
        </form>
            
    )
}