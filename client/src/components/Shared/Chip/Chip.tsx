import clsx from 'clsx'
import React from 'react'
import type { ReactNode } from 'react'
import style from './Chip.module.css'
import type { ColorTypes } from '../../../types'

type ChipProps = {
  children: ReactNode
  color?: ColorTypes & 'violet'
  top?: number
  bottom?: number
  left?: number
  right?: number
  hide?: boolean
  fontSize?: number
  small?: boolean
  leftSide?: boolean
  rightSide?: boolean
}

export default function Chip({
  children,
  color = 'gray',
  top,
  left,
  bottom,
  right,
  hide,
  fontSize,
  small = false,
  leftSide,
  rightSide,
}: ChipProps): JSX.Element {
  return (
    <div
      style={{
        top: `${top}rem`,
        bottom: `${bottom}rem`,
        left: `${left}rem`,
        right: `${right}rem`,
        fontSize: `${fontSize}rem`,
      }}
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
