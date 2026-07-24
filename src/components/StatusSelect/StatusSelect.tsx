import styles from './StatusSelect.module.css'

type StatusSelectProps = {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
};

export default function StatusSelect({
    label,
    value,
    options,
    onChange,
}: StatusSelectProps) {

    const getClass = (option: string) => {
        switch(option){
            case "À faire":
                return styles.todo;
            case "En cours":
                return styles.progress;
            case "Terminée":
                return styles.done;
            default:
                return "";
        }
    }

    // Permet de faire la conversion label -> donnée attendue par la payload
    const statusMap: Record<string, string> = {
        "À faire": "TODO",
        "En cours": "IN_PROGRESS",
        "Terminée": "DONE",
    };

    return (
        <div>
            <label>{label}</label>

            <div className={styles.container}>
                {options.map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(statusMap[option])}
                        className={`
                            ${styles.button}
                            ${getClass(option)}
                            ${value === statusMap[option] ? styles.selected : ""}
                        `}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}