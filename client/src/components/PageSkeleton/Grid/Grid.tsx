import type { ReactNode } from 'react'
import React from 'react'
import clsx from 'clsx'
import style from './Grid.module.css'

type GridProps = {
  children: ReactNode
  //   center?: boolean
  centerHorizontal?: boolean
  centerVertical?: boolean
  maxWidth?: number
  spaceBetween?: boolean
  //   onClick?: (e) => void
  //   link?: boolean // кнопка-ссылка или обычная кнопка
  //   disabled?: boolean // заблочить
  //   color?: 'neutral' | 'danger' | 'good' | 'warning' | 'gray'| undefined // цвет
}

export default function Grid({
  children,
  //   center = false,
  centerHorizontal,
  centerVertical,
  maxWidth,
  spaceBetween
}: GridProps): JSX.Element {
  return (
    <div
      // style={{
      //     justifyContent: centerHorizontal ? 'center' : 'initial',
      //     alignItems: centerVertical ? 'center' : 'initial',
      //   }}
      className={clsx(style.wrapper, spaceBetween && style.spaceBetween)}
      style={{
        justifyContent: centerHorizontal ? 'center' : 'initial',
        alignItems: centerVertical ? 'center' : 'initial',
        // ...(maxWidth !== undefined ? {maxWidth: `${maxWidth}`} : {})
      }}
    >
      <div
        style={{
          justifyContent: centerHorizontal ? 'center' : 'initial',
          alignItems: centerVertical ? 'center' : 'initial',
          ...(maxWidth !== undefined ? {maxWidth: `${maxWidth}px`} : {})
        }}
        className={clsx(style.grid, spaceBetween && style.spaceBetween)}
      >
        {children}
      </div>
    </div>
  )
}
