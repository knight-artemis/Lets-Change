import React from 'react'
import style from './Card.module.css'

export default function Card({thing}:SimplifiedThingType):JSX.Element {
  return (
    <Button key={thing.id} link onClick={() => void navigate(`/thing/${thing.id}`)}>
    <div className={style.card}>
      <div className={style.timeLeft}>{getTimeLeft(thing.endDate)}</div>
      <div className={style.photo}>
        <img src={`${import.meta.env.VITE_UPLOADS}/things/${thing.photoUrl}`} alt='фотка-шмотка'/>
      </div>
      <div className={style.name}>
        <center>{thing.thingName}</center>
      </div>
      <div className={clsx(Math.random() > .5  ? style.favorite : style.notFavorite)} />
    </div>
  </Button>
  )
}
