import clsx from 'clsx'
import React from 'react'
import type { ReactNode } from 'react'
import style from './Chip.module.css'

type ChipProps = {
  children: ReactNode // Используем ReactNode для разрешения передачи любых дочерних элементов
  //   onClick?: (event?: MouseEvent<HTMLButtonElement>) => void // Тип для функции onClick
  // link?: boolean // кнопка-ссылка или обычная кнопка
  // disabled?: boolean // заблочить
  color?: 'neutral' | 'danger' | 'good' | 'warning' | 'gray' | undefined // цвет
  top?: number
  bottom?: number
  left?: number
  right?: number
  hide?: boolean
}

export default function Chip({
  children,
  color = 'gray',
  top = 0.5,
  left = 0.5,
  bottom,
  right,
  hide
}: ChipProps): JSX.Element {
  return (
    <div
    style={{top: `${top}rem`, bottom: `${bottom}rem`,left: `${left}rem`,right: `${right}rem`}}
      className={clsx(
        style.chip,
        style[color],
        // top && style.top,
        // bottom && style.bottom,
        // left && style.left,
        // right && style.right,
        hide && style.hide
      )}
    >
      {children}
    </div>
  )
}

/*
 <div className={clsx(style.chip, style.timeLeft)}>{getTimeLeft(thing.endDate)}</div>

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
*/
