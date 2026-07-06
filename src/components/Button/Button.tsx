type ButtonType = "black" | "orange"
type ButtonWidth = "small" | "medium" | "large" | "xlarge"

type ButtonProps = {
    type: ButtonType;
    width: ButtonWidth;
    onClick: () => void;
    children?: React.ReactNode;
}

const variants: Record<ButtonType, React.CSSProperties> = {
black: { background: "black", color: "white" },
orange: { background: "var(--dark-orange)", color: "white" },
};

const sizes: Record<ButtonWidth, React.CSSProperties> = {
small: { width: "94px" },
medium: { width: "121px" },
large: { width: "151px" },
xlarge: { width: "181px" }
};

const baseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  height: "50px" 
};

export default function Button({type, width, onClick, children}: ButtonProps) {
    return (
        <button 
            onClick={onClick} 
            style={{
                ...variants[type],
                ...sizes[width],
                ...baseStyle
            }}>
            { children }
        </button>
    )
    
}