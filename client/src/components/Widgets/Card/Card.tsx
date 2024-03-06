import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import clsx from 'clsx'
import Button from '../../Controls/Button/Button'
import type { SimplifiedThingType } from '../../../types'
import style from './Card.module.css'

const ThingInitVal = {
  id: 0,
  thingName: '',
  categoryId: 0,
  thingAddress: '',
  thingLat: 0,
  thingLon: 0,
  endDate: new Date(),
  photoUrl: '',
}

type CardProps = {
  thing: SimplifiedThingType
}

export default function Card({ thing }: CardProps): JSX.Element {
  function getTimeLeft(endDate: Date): string {
    const msDelta = new Date(endDate).getTime() - new Date().getTime()
    if (msDelta <= 0) return 'время вышло'

    const msInHour = 1000 * 60 * 60
    const msInDay = msInHour * 24
    const msInWeek = msInDay * 7
    const msInMonth = msInDay * 30

    if (msDelta < msInDay) {
      // Если разница меньше дня
      const hoursDiff = Math.round(msDelta / msInHour)
      return `осталось ${hoursDiff} ч.`
    }
    if (msDelta < msInWeek) {
      // Если разница меньше недели
      const daysDiff = Math.round(msDelta / msInDay)
      return `осталось ${daysDiff} д.`
    }
    if (msDelta < msInMonth) {
      // Если разница меньше месяца
      const weeksDiff = Math.round(msDelta / msInWeek)
      return `осталось ${weeksDiff} нед.`
    }
    // Если разница больше месяца
    const monthsDiff = Math.round(msDelta / msInMonth)
    return `осталось ${monthsDiff} мес.`
  }

  // const [oneThing, setOneThing] = useState<SimplifiedThingType>(ThingInitVal)

  const navigate = useNavigate()

  // useEffect(() => {
  //   axios
  //     .get<SimplifiedThingType>(
  //       `${import.meta.env.VITE_API}/v1/things/${thing.id}`, { withCredentials: true })
  //     .then((res) => setOneThing(res.data))
  //     .catch((err) => console.log('Ошибка получения всех вещей', err))
  // }, [thing.id])

  return (
    <Button
      key={thing.id}
      link
      onClick={() => void navigate(`/thing/${thing.id}`)}
    >
      <div className={style.card}>
        <div className={style.timeLeft}>{getTimeLeft(thing.endDate)}</div>
        <div className={style.photo}>
          <img
            src={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
            alt='фотка-шмотка'
          />
        </div>
        <div className={style.name}>
          <center>{thing.thingName}</center>
        </div>
        <div
          className={clsx(
            Math.random() > 0.5 ? style.favorite : style.notFavorite,
          )}
        />
      </div>
    </Button>
  )
}
