import React from 'react'
import type { ReactNode } from 'react'
import style from './TopLine.module.css'

type TopLineProps = {
  children: ReactNode
}

export default function TopLine({ children }:TopLineProps): JSX.Element {
  return (
    <div className={style.topLine}>
      {children}
      {/* <span className={style.span}>Посмотреть объявления списком</span>

      <span className={style.span}>или на карте</span> */}
    </div>
  )
}
