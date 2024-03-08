import type { ReactNode, MouseEvent } from 'react'
import React from 'react'
import style from './Button.module.css'
import clsx from 'clsx'

type ButtonProps = {
  children: ReactNode // Используем ReactNode для разрешения передачи любых дочерних элементов
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void // Тип для функции onClick
  link?: boolean // кнопка-ссылка или обычная кнопка
  disabled?: boolean // заблочить
  color?: 'neutral' | 'danger' | 'good' | 'warning' | undefined // цвет
}

export default function Button({
  children,
  onClick,
  link = false,
  color,
  disabled = false,
}: ButtonProps): JSX.Element {
  return (
    <button
      type='button'
      disabled={disabled}
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
