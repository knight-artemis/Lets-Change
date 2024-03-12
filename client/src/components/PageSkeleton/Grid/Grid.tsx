import type { ReactNode } from 'react'
import React from 'react'
import clsx from 'clsx'
import style from './Grid.module.css'

type GridProps = {
  children: ReactNode 
  center?: boolean
//   onClick?: (e) => void 
//   link?: boolean // кнопка-ссылка или обычная кнопка
//   disabled?: boolean // заблочить
//   color?: 'neutral' | 'danger' | 'good' | 'warning' | 'gray'| undefined // цвет
}

export default function Grid({children,center}:GridProps):JSX.Element {
  return (
    <div style={center ? { justifyContent: 'center' } : {}} className={style.grid}>{children}</div>
  )
}
