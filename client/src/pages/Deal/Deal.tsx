import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import clsx from 'clsx'
import style from './Deal.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'
import CardSimple from '../../components/Widgets/CardSimple/CardSimple'
import Chat from '../../components/Chat/Chat'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchGetNot } from '../../redux/user/userThunkActions'

export default function Deal(): JSX.Element {
  const [deal, setDeal] = useState<OneDealDetailed>()
  const user = useAppSelector((store) => store.userSlice.user)
  const { id } = useParams()
  const dispatcher = useAppDispatch()

  useEffect(() => {
    console.log('RERENDER')
    void (async () => {
      const res = await axios.get<OneDealDetailed>(
        `${import.meta.env.VITE_API}/v1/deals/${id}`,
        {
          withCredentials: true,
        },
      )
      setDeal(res.data)
      if (user.id === res.data.initiatorId) {
        await axios.patch(
          `${import.meta.env.VITE_API}/v1/deals/${res.data.id}/note`,
          { initiatorNote: false },
        )
      } else if (user.id === res.data.receiverId) {
        await axios.patch(
          `${import.meta.env.VITE_API}/v1/deals/${res.data.id}/note`,
          { recieverNote: false },
        )
      }
      await dispatcher(fetchGetNot())
    })()
    // const dealPrommise = axios
    //   .get<OneDealDetailed>(`${import.meta.env.VITE_API}/v1/deals/${id}`, {
    //     withCredentials: true,
    //   })
    //   .then((res) => setDeal(res.data))
    //   .catch((err) => console.log('Ошибка получения подробной сделки', err))
  }, [id])

  if (!deal) return <div /> //! тут потом будет спиннер
  return (
    <div className={style.wrapper}>
      <div className={style.left}>
        <div className={style.thing}>
          <div className={style.text}>{deal && deal.initiatorId === user.id ? 'За эту вещь' : 'Твою вещь'}</div>
          <CardSimple hoverable thing={deal && deal.Thing} />
          {/* <CardSimple hoverable thing={deal && deal.initiatorId === user.id ? deal.initiatorThings[0] : deal.Thing} /> */}
          <div className={style.text}>{deal && deal.initiatorId === user.id ? 'ты предлагаешь' : 'меняют на'}</div>
          <CardSimple hoverable thing={deal && deal.initiatorThings[0]} />
          {/* <CardSimple hoverable thing={deal && deal.initiatorId === user.id ? deal.Thing : deal.initiatorThings[0]} /> */}
        </div>
        <Button color='good'>Сделка завершена</Button>
      </div>

      <div className={style.right}>
        <Chat deal={deal} />
      </div>
    </div>
  )
}
