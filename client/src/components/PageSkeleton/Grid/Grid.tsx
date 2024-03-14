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
}: GridProps): JSX.Element {
  return (
    <div
      // style={{
      //     justifyContent: centerHorizontal ? 'center' : 'initial',
      //     alignItems: centerVertical ? 'center' : 'initial',
      //   }}
      className={style.wrapper}
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
        }
        }
        className={style.grid}
      >
        {children}
      </div>
    </div>
  )
}
