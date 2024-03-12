import React from 'react'
import type { ReactNode } from 'react'
import style from './MainContent.module.css'

type MainContentProps = {
  children: ReactNode
  // center?: boolean
  centerHorizontal?: boolean
  centerVertical?: boolean
}

export default function MainContent({
  children,
  centerHorizontal,
  centerVertical,
}: MainContentProps): JSX.Element {
  return (
    <div
      style={{
        justifyContent: centerHorizontal ? 'center' : 'initial',
        alignItems: centerVertical ? 'center' : 'initial',
      }}
      className={style.mainContent}
    >
      {children}
    </div>
  )
}
