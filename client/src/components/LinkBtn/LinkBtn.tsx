import React from 'react'
import style from './LinkBtn.module.css'

type BytttonProps = {
  onClick: () => void;
  title: string,
}

export default function Button({onClick, title}: BytttonProps): JSX.Element {
  return (
    <button  className={style.button} onClick={onClick} type='button'>{title}</button>
  )
}
