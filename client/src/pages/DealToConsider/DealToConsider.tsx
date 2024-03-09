import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import style from './DealToConsider.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'

export default function DealToConsider(): JSX.Element {
  const [deal, setDeal] = useState<OneDealDetailed>()
  const { id } = useParams()

  useEffect(() => {
    axios
      .get<OneDealDetailed>(`${import.meta.env.VITE_API}/v1/deals/${id}`, {
        withCredentials: true,
      })
      .then((res) => setDeal(res.data))
      .catch((err) => console.log('Ошибка получения подробной сделки', err))
  }, [id])

  return (
    <div className={style.wrapper}>
      <div className={style.topLine}>{deal?.Thing.thingName}</div>
      <div className={style.middleLine}>{deal?.initiatorThings.map(initiatorsThing => 
        <div className={style.oneThing}>{initiatorsThing.thingName}</div>)}</div>
      <div className={style.bottomLine}>
        <Button color='good'>Давай меняться</Button>
        <Button color='danger'>Не хочу меняться</Button>
      </div>
    </div>
  )
}
