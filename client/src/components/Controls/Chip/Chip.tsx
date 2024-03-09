import clsx from 'clsx'
import React from 'react'
import type { ReactNode } from 'react'
import style from './Chip.module.css'

type ChipProps = {
  children: ReactNode 
  color?: 'neutral' | 'danger' | 'good' | 'warning' | 'gray' | 'none' | undefined // цвет
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
        hide && style.hide
      )}
    >
      {children}
    </div>
  )
}
