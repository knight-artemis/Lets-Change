import React from 'react'
import type { ReactNode } from 'react'
import style from './MainContent.module.css'

type MainContentProps = {
  children: ReactNode
  center?: boolean
}

export default function MainContent({ children, center }: MainContentProps): JSX.Element {
  return (
    <div style={center ? { justifyContent: 'center' } : {}} className={style.mainContent}>
      {children}
    </div>
  )
}
