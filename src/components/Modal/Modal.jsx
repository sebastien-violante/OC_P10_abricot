import styles from './Modale.module.css'

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      <button onClick={onClose}>X</button>
      </div>
    </div>
  );
}
