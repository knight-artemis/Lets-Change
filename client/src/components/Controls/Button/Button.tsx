import type { ReactNode } from 'react';
import React from 'react'
import style from './Button.module.css'

type ButtonProps = {
  children: ReactNode // Используем ReactNode для разрешения передачи любых дочерних элементов
  onClick?: () => void // Тип для функции onClick
  link?: boolean // кнопка-ссылка или обычная кнопка
}

export default function Button({ children, onClick, link = false }: ButtonProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={link ? style.link : style.btn}>
      {children}
    </button>
  )
}
