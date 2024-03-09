import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import clsx from 'clsx'
import style from './Deal.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'
import Input from '../../components/Shared/Input/Input'
import CardSimple from '../../components/Widgets/CardSimple/CardSimple'

export default function Deal(): JSX.Element {
  const [deal, setDeal] = useState<OneDealDetailed>()
  const [msgInput, setMsgInput] = useState<string>('')
  const { id } = useParams()

  useEffect(() => {
    axios
      .get<OneDealDetailed>(`${import.meta.env.VITE_API}/v1/deals/${id}`, {
        withCredentials: true,
      })
      .then((res) => setDeal(res.data))
      .catch((err) => console.log('Ошибка получения подробной сделки', err))
  }, [id])

  const weChangedHandler = (): void => {
    //
  }
  const sendMsgHandler = (): void => {
    //
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMsgInput(() => e.target.value)
  }

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
        <div className={style.chat}>
          <div className={clsx(style.msg, style.myMsg)}>привет, давай меняться!</div>
          <div className={clsx(style.msg,style.hisMsg)}>привет, конечно давай!</div>
        </div>

        <div className={style.input}>
          <Input name='chatMsg' onChange={changeHandler} value={msgInput} />
          <Button>отправить</Button>
        </div>
      </div>

    </div>
  )
}
