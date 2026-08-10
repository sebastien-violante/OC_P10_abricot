type ButtonColor = "black" | "orange" | "grey"
type ButtonWidth = "small" | "medium" | "mediumplus" | "large" | "xlarge" | "xxlarge"
type ButtonType = "submit" | ""

type ButtonProps = {
    color: ButtonColor;
    width: ButtonWidth;
    onClick?: () => void;
    type?: ButtonType;
    children?: React.ReactNode;
}

const variants: Record<ButtonColor, React.CSSProperties> = {
    black: { background: "black", color: "white" },
    orange: { background: "var(--dark-orange)", color: "white" },
    grey: { background: "var(--grey200", color: "var(--grey800)" }
};

const sizes: Record<ButtonWidth, React.CSSProperties> = {
    small: { width: "94px" },
    medium: { width: "121px" },
    mediumplus: {width: "141px"},
    large: { width: "151px" },
    xlarge: { width: "181px" },
    xxlarge: { width: "244px"}
};

const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    height: "50px",
    marginTop: "56px"
};

export default function Button({color, width, onClick, children}: ButtonProps) {
    return (
        <button 
            onClick={onClick} 
            style={{
                ...variants[color],
                ...sizes[width],
                ...baseStyle
            }}>
            { children }
        </button>
    )
    
}