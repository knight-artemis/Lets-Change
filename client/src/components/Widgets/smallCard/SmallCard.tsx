import React from 'react'
import type { SimplifiedThingType } from '../../../types'
import styles from './SmallCard.module.css'

type SmallCardProps = {
  thing: SimplifiedThingType
}

export default function SmallCard({ thing }: SmallCardProps): JSX.Element {
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
  return (
    <div className={styles.card}>
      <div className={styles.photo}>
        <img
          src={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
          alt={thing.thingName}
        />
      </div>
      <span>
        <h3>
          {thing.thingName.length < 40
            ? thing.thingName
            : `${thing.thingName.slice(0, 37)}...`}
        </h3>
        <p>{getTimeLeft(thing.endDate)}</p>
      </span>
    </div>
  )
}
