'use client'

import styles from './Modal.module.css'
import { ReactNode, useEffect, useRef } from 'react'

type ModalProps = {
  onClose: () => void
  children: ReactNode
  titleId: string
}

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function Modal({
  onClose,
  children,
  titleId,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  // On garde toujours la dernière version de onClose
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Gestion du focus et du clavier
  useEffect(() => {
    // On mémorise l'élément qui avait le focus AVANT de le déplacer
    previousActiveElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const modal = modalRef.current
    if (!modal) return

    // Focus initial dans la modale
    const firstFocusableElement =
      modal.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)

    if (firstFocusableElement) {
      firstFocusableElement.focus()
    } else {
      modal.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        modal.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement =
        focusableElements[focusableElements.length - 1]

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Restauration du focus lorsque le composant est réellement démonté
  useEffect(() => {
    return () => {
      previousActiveElement.current?.focus()
    }
  }, [])

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCloseRef.current()
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
        <div className={styles.modalContent}>
          {children}
        </div>

        <button
          type="button"
          onClick={() => onCloseRef.current()}
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
  )
}
