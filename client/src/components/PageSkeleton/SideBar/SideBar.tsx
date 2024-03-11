import React from 'react'
import type { ReactNode } from 'react'
import style from './SideBar.module.css'

type SideBarProps = {
  children: ReactNode
  center?: boolean
}

export default function SideBar({
  children,
  center,
}: SideBarProps): JSX.Element {
  return <div style={center ? { alignItems: 'center'} : {}} className={style.sidebar}>{children}</div>
}
