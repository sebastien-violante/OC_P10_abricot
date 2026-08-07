'use client'

import styles from './Modal.module.css'
import { ReactNode, useEffect, useRef} from 'react';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  titleId: string;
}

export default function Modal({ onClose, children, titleId }: ModalProps) {

  const modalRef = useRef<HTMLDivElement>(null)
  // Élément qui avait le focus avant l'ouverture de la modale 
  const previousActiveElement = useRef<HTMLElement | null>(null)
  
  useEffect(() => { 
  
    previousActiveElement.current = document.activeElement as HTMLElement
    const firstFocusableElement = modalRef.current?.querySelector<HTMLElement>( 
      'button:not([disabled]),input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])' 
    )
    firstFocusableElement?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { 
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') { return }
      if (!modalRef.current) { return }
      
      const focusableElements = Array.from( modalRef.current.querySelectorAll<HTMLElement>( 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])' ) )

      if (focusableElements.length === 0) { 
        event.preventDefault() 
        return 
      }
      const firstElement = focusableElements[0] 
      const lastElement = focusableElements[focusableElements.length - 1]
      
      // SHIFT + TAB depuis le premier élément 
      if ( event.shiftKey && document.activeElement === firstElement ) { 
        event.preventDefault() 
        lastElement.focus() 
        return 
      } 
      // TAB depuis le dernier élément 
      if ( !event.shiftKey && document.activeElement === lastElement ) { 
        event.preventDefault() 
        firstElement.focus() 
      }

    } 
    document.addEventListener('keydown', handleKeyDown) 
    return () => { 
      document.removeEventListener('keydown', handleKeyDown) 
      // Restaurer le focus après fermeture 
      previousActiveElement.current?.focus()
    }
   }, [onClose])

  return (
    
      <div
        className={styles.overlay}
        onMouseDown={(event) => { 
          if (event.target === event.currentTarget) { 
            onClose() 
          } 
        }}
      >
        <div 
          ref={modalRef} 
          className={styles.modal} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby={titleId} 
          tabIndex={-1} 
          >
          {children}
          <button 
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre" 
            className={styles.closeButton}
          >
            <img 
              className={styles.cross} 
              src="/pictures/static/cross.png"
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
  );
}
