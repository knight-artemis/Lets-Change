import React from 'react'
import clsx from 'clsx'
import style from './CardSimple.module.css'

type CardSimpleProps = {
  thing?: {
    thingName: string
    photoUrl: string
  }
  size?: number
  hoverable?: boolean
}

export default function CardSimple({ thing , size=200, hoverable}: CardSimpleProps): JSX.Element {
  return (
    <div className={clsx(style.card, hoverable && style.hoverable)} style={{ width: `${size}px`, height: `${size}px`}}>
      <div className={clsx(style.center, style.photoWrapper)}>
        <img
          className={clsx(style.center, style.photoBg)}
          src={`${import.meta.env.VITE_THINGS}/${thing?.photoUrl}`}
          alt={thing?.thingName}
        />
        <img
          className={clsx(style.center, style.photo)}
          src={`${import.meta.env.VITE_THINGS}/${thing?.photoUrl}`}
          alt={thing?.thingName}
        />
      </div>

      <div className={style.name}>
        <center>
          {thing && thing.thingName.length < 40
            ? thing.thingName
            : `${thing?.thingName.slice(0, 37)}...`}
        </center>
      </div>
    </div>
  )
}
   
