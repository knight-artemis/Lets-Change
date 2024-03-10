import React from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import style from './SvgLink.module.css'

export default function SvgLink({
  children,
  icon,
  text,
  relative,
}: {
  children?: ReactNode
  icon?: string
  text?: string
  relative?: boolean
}): JSX.Element {
  return (
    <div className={clsx(style.svgLink, relative && style.relative)}>
      {icon && <img className={style.icon} src={icon} alt='svg' />}
      <div>{text || children}</div>
    </div>
  )
}
