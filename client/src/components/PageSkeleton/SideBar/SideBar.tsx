import React from 'react'
import type { ReactNode } from 'react'
import style from './SideBar.module.css'

type SideBarProps = {
  children: ReactNode
}

export default function SideBar({ children }: SideBarProps): JSX.Element {
  return <div className={style.sidebar}>{children}</div>
}
