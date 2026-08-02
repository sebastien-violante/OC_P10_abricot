import styles from './Modal.module.css'
import { ReactNode } from 'react';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      <button onClick={onClose}>
        <img className={styles.cross} src="/pictures/static/cross.png"/>
      </button>
      </div>
    </div>
  );
}
