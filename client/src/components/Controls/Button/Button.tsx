import type { ReactNode } from 'react'
import React from 'react'
import style from './Button.module.css'
import clsx from 'clsx'

type ButtonProps = {
  children: ReactNode // Используем ReactNode для разрешения передачи любых дочерних элементов
  onClick?: () => void // Тип для функции onClick
  link?: boolean // кнопка-ссылка или обычная кнопка
  color?: 'neutral' | 'danger' | 'good' | 'warning' | undefined
}

export default function Button({
  children,
  onClick,
  link = false,
  color,
}: ButtonProps): JSX.Element {
  // let colorClass
  // switch (color) {
  //   case: 'neutral'
  //   colorClass =
  // }
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        link ? style.link : style.btn,
        color ? style[color] : style.neutral,
      )}
    >
      {children}
    </button>
  )
}
