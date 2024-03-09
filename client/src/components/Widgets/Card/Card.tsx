import React from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Button from '../../Controls/Button/Button'
import type { SimplifiedThingType } from '../../../types'
import style from './Card.module.css'
import { useAppSelector } from '../../../redux/hooks'
import Chip from '../../Controls/Chip/Chip'

type CardProps = {
  thing: SimplifiedThingType
}

export default function Card({ thing }: CardProps): JSX.Element {

  const user = useAppSelector((store) => store.userSlice.user)


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
      return `осталось ${daysDiff} дн.`
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

  const navigate = useNavigate()

  console.log(thing);

  return (
    <Button
      key={thing.id}
      link
      onClick={() => void navigate(`/thing/${thing.id}`)}
    >

      <div className={style.card}>
      {/* <div className={clsx(style.card, thing.inDeal && style.inDeal, !thing.isApproved && style.notApproved)}> */}
      {/* <div className={clsx(style.mask, thing.inDeal && style.inDeal, !thing.isApproved && style.notApproved)}> */}
        {/* <div className={clsx(style.chip, style.timeLeft)}>{getTimeLeft(thing.endDate)}</div> */}
        <Chip>{getTimeLeft(thing.endDate)}</Chip>
        <Chip hide={!thing.inDeal && thing.isApproved} top={3} color={thing.inDeal ? 'good' : 'warning'}>{thing.inDeal ? 'в сделке' : 'на модерации'}</Chip>
        {/* <Chip >на модерации</Chip> */}
        {/* <div className={clsx(style.hide, style.chip, thing.inDeal && style.inDealChip)}>в сделке</div>
        <div className={clsx(style.hide, style.chip, !thing.isApproved && style.notApprovedChip)}>на модерации</div> */}
        <div className={clsx(style.photo, (thing.inDeal || !thing.isApproved) && style.notActive)}>
          <img
            src={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
            alt='фотка-шмотка'
            />
        </div>
        <div className={style.name}>
          <center>{thing.thingName.length < 40 ? thing.thingName : `${thing.thingName.slice(0,37)}...`}</center>
        </div>
        <div
          className={clsx(
            Math.random() > 0.5 ? style.favorite : style.notFavorite,
            )}
        />
      {/* </div> */}
            </div>
    </Button>
  )
}
