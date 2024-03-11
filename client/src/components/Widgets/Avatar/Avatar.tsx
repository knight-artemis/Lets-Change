import React from 'react'
import style from './Avatar.module.css'

type AvatarProps = {
  size?: number
  letter?: string
  src?: string
}

export default function Avatar({
  size = 3,
  letter = '?',
  src,
}: AvatarProps): JSX.Element {
  return (
    <div
      style={{ width: `${size}rem`, height: `${size}rem` }}
      className={style.avatar}
    >
      {src ? (
        <img className={style.img} src={src} alt='avatar' />
      ) : (
        <div style={{ fontSize: `${size * 0.8}rem` }} className={style.letter}>
          {letter.toUpperCase()}
        </div>
      )}
    </div>
  )
}
