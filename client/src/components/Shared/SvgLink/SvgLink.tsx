import React from 'react'
import style from './SvgLink.module.css'

export default function SvgLink({
  icon,
  text,
}: {
  icon?: string
  text?: string
}): JSX.Element {
  return (
    <div className={style.svgLink}>
     {icon && <img
        className={style.icon}
        src={icon}
        alt='svg'
      />}
      <div>{text || ''}</div>
    </div>
  )
}
