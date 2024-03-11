import React from 'react'
import type { ReactNode } from 'react'
import style from './MainContent.module.css'

type MainContentProps = {
  children: ReactNode
}

export default function MainContent({ children }: MainContentProps): JSX.Element {
  return <div className={style.mainContent}>{children}</div>
}
