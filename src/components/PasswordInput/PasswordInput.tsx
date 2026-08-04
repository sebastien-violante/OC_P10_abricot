import { useState } from "react"
import styles from './PasswordInput.module.css'
import { UserPasswordFormData } from "@/types/types"

type PasswordInputProps = {
    name: keyof UserPasswordFormData;
    label: string;
    userPasswordFormData: UserPasswordFormData;
    setUserPasswordFormData: React.Dispatch<React.SetStateAction<UserPasswordFormData>>;
}

export default function PasswordInput({label, name, userPasswordFormData, setUserPasswordFormData}: PasswordInputProps) {

    const [clear, setClear] = useState(false)

    const toggleClear = () => {
        setClear((prev) => !prev)
    }

    return (
        <div className={styles.formGroup}>
            <label htmlFor={name}>{label}</label>
            <div className={styles.inputZone}>
                <input 
                type={clear ? "text" : "password"}
                name={name} 
                id={name}
                onChange={(e) => setUserPasswordFormData({...userPasswordFormData, [name]: e.target.value})} 
                required />
                { clear && <img className={styles.eye} src="/pictures/static/eye-slash-solid-full.svg" onClick={toggleClear}/>}
                { !clear && <img className={styles.eye} src="/pictures/static/eye-solid-full.svg" onClick={toggleClear}/>}
            </div>
            
        </div>
    )
}