import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import style from './Deal.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'

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
      <div className={style.textCol}>Моя вещь:</div>
      <div className={style.topLine}>
        <div className={style.oneThing}>
          <div className={style.photo}>
            <img
              src={`${import.meta.env.VITE_THINGS}/${deal?.Thing.photoUrl}`}
              alt='фотка-шмотка'
            />
          </div>

          <div className={style.textCol}>
            <div className={style.name}>{deal?.Thing.thingName}</div>
          </div>
        </div>
      </div>
      <div className={style.textCol}>
        Предлагаемые вещи (нажми, что бы выбрать):
      </div>
      <div className={style.middleLine}>
        {deal?.initiatorThings.map((hisOneThing) => (
          <div key={hisOneThing.id} className={style.oneThing}>
            <div className={style.photo}>
              <img
                src={`${import.meta.env.VITE_THINGS}/${hisOneThing.photoUrl}`}
                alt='фотка-шмотка'
              />
            </div>

            <div className={style.textCol}>
              <div className={style.name}> {hisOneThing.thingName}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={style.bottomLine}>
        <Button color='good' onClick={agreedHandler}>
          Давай меняться
        </Button>
        <Button color='danger' onClick={cancelHandler}>
          Не хочу меняться
        </Button>
      </div>
    </div>
  )
}
