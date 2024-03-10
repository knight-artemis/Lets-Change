import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import clsx from 'clsx'
import style from './Deal.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'
import CardSimple from '../../components/Widgets/CardSimple/CardSimple'
import Chat from '../../components/Chat/Chat'

export default function Deal(): JSX.Element {
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

  if (!deal) return <div /> //! тут потом будет спиннер

  return (
    <div className={style.wrapper}>
      <div className={style.left}>
        <div className={style.thing}>
          <div className={style.text}>Твою вещь</div>
          <CardSimple hoverable thing={deal?.Thing} />
          <div className={style.text}>меняют на</div>
          <CardSimple hoverable thing={deal?.initiatorThings[0]} />
        </div>
        <Button color='good'>Сделка завершена</Button>
      </div>

      <div className={style.right}>
        <Chat deal={deal}/>
      </div>
    </div>
  )
}
