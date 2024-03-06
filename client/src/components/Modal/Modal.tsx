import React from 'react'
import clsx from 'clsx'
import style from './Modal.module.css'

type ModalProps = {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Modal({ active, setActive }: ModalProps): JSX.Element {
  
  //! Попытка открывать и закрывать модалку по нажатию клавиш, можно потом попробовать добить в родительском элементе ThingPage
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
        Ура, модалка работает
        <button type='button' onClick={() => setActive((prev) => !prev)}>
          Закрыть
        </button>
      </div>
    </div>
  )
}
