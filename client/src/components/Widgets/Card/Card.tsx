import React from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Button from '../../Shared/Button/Button'
import type { SimplifiedThingType } from '../../../types'
import style from './Card.module.css'
import { useAppSelector } from '../../../redux/hooks'
import Chip from '../../Shared/Chip/Chip'
import SvgLink from '../../Shared/SvgLink/SvgLink'
import getRemainigTime from '../../../service/getRemainigTime'

type CardProps = {
  thing: SimplifiedThingType
  isMain?: boolean
}

export default function Card({ thing, isMain }: CardProps): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)
  // console.log(thing)

  // function getTimeLeft(endDate: Date): string {
  //   const msDelta = new Date(endDate).getTime() - new Date().getTime()
  //   if (msDelta <= 0) return 'время вышло'

  //   const msInHour = 1000 * 60 * 60
  //   const msInDay = msInHour * 24
  //   const msInWeek = msInDay * 7
  //   const msInMonth = msInDay * 30

  //   if (msDelta < msInDay) {
  //     // Если разница меньше дня
  //     const hoursDiff = Math.round(msDelta / msInHour)
  //     return `осталось ${hoursDiff} ч.`
  //   }
  //   if (msDelta < msInWeek) {
  //     // Если разница меньше недели
  //     const daysDiff = Math.round(msDelta / msInDay)
  //     return `осталось ${daysDiff} дн.`
  //   }
  //   if (msDelta < msInMonth) {
  //     // Если разница меньше месяца
  //     const weeksDiff = Math.round(msDelta / msInWeek)
  //     return `осталось ${weeksDiff} нед.`
  //   }
  //   // Если разница больше месяца
  //   const monthsDiff = Math.round(msDelta / msInMonth)
  //   return `осталось ${monthsDiff} мес.`
  // }

  const navigate = useNavigate()

  return (
    <Button
      key={thing.id}
      link
      onClick={() => void navigate(`/thing/${thing.id}`)}
    >
      <div
        className={style.card}
      >
        <Chip top={0.5} left={-0.5} leftSide>
          осталось {getRemainigTime(thing.endDate)}
        </Chip>
        {(thing.inDeal || !thing.isApproved) && (
          <Chip
            top={0.5}
            right={-0.5}
            rightSide
            color={(thing.inDeal && 'good') || (thing.issue && 'danger') || 'warning'}>
            {(thing.inDeal && 'в сделке') || (thing.issue && 'отказ в публикации') || 'на модерации'}
          </Chip>
        )}
        {isMain && thing.userId === user.id && (
          <Chip top={0.5} right={-0.5} rightSide color='neutral'>
            Моя вещь
          </Chip>
        )}
        {/* {isMain && thing.userId !== user.id && (
          <Chip top={0} right={-0.5} color='none'>
            <SvgLink icon='./assets/icons/star-favorite.svg' />
          </Chip>
        )} */}

        <div
          className={clsx(
            style.center,
            style.photoWrapper,
            (thing.inDeal || !thing.isApproved) && style.notActive,
          )}
        >
          <img
            className={clsx(style.center, style.photoBg)}
            src={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
            alt='фотка-шмотка'
          />
          <img
            className={clsx(style.center, style.photo)}
            src={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
            alt='фотка-шмотка'
          />
        </div>

        <div className={style.name}>
          <center>
            {thing.thingName.length < 40
              ? thing.thingName
              : `${thing.thingName.slice(0, 37)}...`}
          </center>
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
