import { useState } from "react"
import styles from './PasswordInput.module.css'
import { UserPasswordFormData } from "@/types/types"

type PasswordInputProps = {
    name: keyof UserPasswordFormData
    label: string
    userPasswordFormData: UserPasswordFormData
    setUserPasswordFormData: React.Dispatch<
        React.SetStateAction<UserPasswordFormData>
    >
}

export default function PasswordInput({
    label,
    name,
    userPasswordFormData,
    setUserPasswordFormData,
}: PasswordInputProps) {

    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const inputId = String(name)
    const buttonLabel = showPassword
        ? "Masquer le mot de passe"
        : "Afficher le mot de passe"

    return (
        <div className={styles.formGroup}>
            <label htmlFor={inputId}>
                {label}
            </label>

            <div className={styles.inputZone}>
                <input
                    type={showPassword ? "text" : "password"}
                    name={inputId}
                    id={inputId}
                    value={userPasswordFormData[name]}
                    onChange={(e) =>
                        setUserPasswordFormData((prev) => ({
                            ...prev,
                            [name]: e.target.value,
                        }))
                    }
                    required
                    autoComplete="current-password"
                />

                <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={togglePasswordVisibility}
                    aria-label={buttonLabel}
                    aria-pressed={showPassword}
                >
                    <img
                        src={
                            showPassword
                                ? "/pictures/static/eye-slash-solid-full.svg"
                                : "/pictures/static/eye-solid-full.svg"
                        }
                        alt=""
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    )
}