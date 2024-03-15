import clsx from 'clsx'
import React from 'react'
import type { ReactNode } from 'react'
import style from './ChipInline.module.css'
import type { ColorTypes } from '../../../types'

type ChipProps = {
  children: ReactNode
  color?: ColorTypes & 'violet'
  hide?: boolean
  fontSize?: number
  small?: boolean
  leftSide?: boolean
  rightSide?: boolean
}

export default function ChipInline({
  children,
  color = 'gray',
  hide,
  fontSize,
  small = false,
  leftSide,
  rightSide,
}: ChipProps): JSX.Element {
  return (
    <div
      style={{ fontSize: `${fontSize}rem` }}
      className={clsx(
        style.chip,
        color && style[color],
        hide && style.hide,
        small && style.small,
        leftSide && style.leftSide,
        rightSide && style.rightSide,
      )}
    >
      {children}
    </div>
  )
}
