import React from 'react'
import clsx from 'clsx'
import style from './Modal.module.css'
import Button from '../../Shared/Button/Button'

type ModalProps = {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  children: JSX.Element
}

export default function Modal({
  active,
  setActive,
  children,
}: ModalProps): JSX.Element {
  //! Попытка открывать и закрывать модалку по нажатию клавиш, можно потом попробовать добить в родительском элементе
  //   const handleKeyDown = (event: React.KeyboardEvent): void => {
  //     if (event.key === 'Escape' && active) {
  //       setActive((prev) => !prev)
  //     } else if (event.key === 'Enter' && !active) {
  //       setActive((prev) => !prev)
  //     }
  //   }

  return (
    <div
      role='button'
      tabIndex={0}
      className={clsx(active ? style.modal : style.active)}
      onClick={() => setActive((prev) => !prev)}
      onKeyDown={(event) => event}
    >
      <div
        role='button'
        tabIndex={0}
        className={`${style.modalContent}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(event) => event}
      >
        <button
          className={clsx(style.close, style.link)}
          type='button'
          onClick={() => setActive((prev) => !prev)}
        >
          <img
            className={style.icon}
            src='/src/assets/icons/close-circle-outline.svg'
            alt='svg'
          />
        </button>
        {children}
      </div>
    </div>
  )
}
