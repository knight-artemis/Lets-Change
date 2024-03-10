/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import style from './DealToConsider.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'
import CardSimple from '../../components/Widgets/CardSimple/CardSimple'

export default function DealToConsider(): JSX.Element {
  const [deal, setDeal] = useState<OneDealDetailed>()
  const [selectedId, setSelectedId] = useState<number>(-1)
  const { id } = useParams()

  useEffect(() => {
    axios
      .get<OneDealDetailed>(`${import.meta.env.VITE_API}/v1/deals/${id}`, {
        withCredentials: true,
      })
      .then((res) => setDeal(res.data))
      .catch((err) => console.log('Ошибка получения подробной сделки', err))
  }, [id])

  const agreedHandler = (): void => {
    // тут запрос в бд и подтверждение сделки
    // затем навигейт на страницу сделки
  }
  const cancelHandler = (): void => {
    // тут запрос в бд и отказ от сделки
    // затем навигейт на страницу всех своих сделок
  }

  const selectorHandler = (thingId: number): void => {
    setSelectedId(thingId)
  }

  // const findSelectedIndex = (things: ) => {

  // }

  return (
    <div className={style.wrapper}>
      <div className={style.textCol}>Моя вещь:</div>
      <div className={style.topLine}>
        <div className={style.oneThing}>
          <CardSimple hoverable thing={deal?.Thing} />
        </div>
      </div>
      <div className={style.textCol}>
        Предлагаемые вещи (нажми, что бы выбрать):
      </div>
      <div className={style.middleLine}>
        {deal?.initiatorThings.map((hisOneThing) => (
          <div key={hisOneThing.id} className={style.oneThing}>
            <input
              // style={{ display: 'none' }}
              className={style.checkbox}
              type='radio'
              id={`thing-${hisOneThing.id}`}
              name='selectedThing'
              checked={selectedId === hisOneThing.id}
            />

            <label
              htmlFor={`thing-${hisOneThing.id}`}
              className={style.radioLabel}
            >
              <div className={style.borderWrapper}>
                <CardSimple hoverable thing={hisOneThing} />
              </div>
            </label>
            <Button onClick={() => selectorHandler(hisOneThing.id)}>
              выбрать
            </Button>
          </div>
        ))}
      </div>
      <div className={style.selectedText}>
        Выбрано: {deal?.initiatorThings[selectedId]?.thingName}
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
