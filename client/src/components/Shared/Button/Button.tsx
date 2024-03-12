import type { ReactNode, MouseEvent } from 'react'
import React from 'react'
import clsx from 'clsx'
import style from './Button.module.css'

type ButtonProps = {
  children: ReactNode
  onClick?: ((e) => void) | ((e) => Promise<void>)
  link?: boolean // кнопка-ссылка или обычная кнопка
  disabled?: boolean // заблочить
  color?: 'neutral' | 'danger' | 'good' | 'warning' | 'gray' | undefined // цвет
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
