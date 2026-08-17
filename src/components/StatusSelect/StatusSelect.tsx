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
         <fieldset className={styles.statusSelect}>
            <legend>{label}</legend>

            <div className={styles.container}>
                {options.map((option) => {
                    const statusValue = statusMap[option]
                    const isSelected = value === statusValue

                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(statusValue)}
                            className={`
                                ${styles.button}
                                ${getClass(option)}
                                ${isSelected ? styles.selected : ''}
                            `}
                            aria-pressed={isSelected}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </fieldset>
    );
}