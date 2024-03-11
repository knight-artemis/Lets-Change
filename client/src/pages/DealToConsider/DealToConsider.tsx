/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import style from './DealToConsider.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'
import CardSimple from '../../components/Widgets/CardSimple/CardSimple'
import { useAppDispatch } from '../../redux/hooks'
import { fetchGetNot } from '../../redux/user/userThunkActions'

export default function DealToConsider(): JSX.Element {
  const [deal, setDeal] = useState<OneDealDetailed>()
  const [selectedThingId, setSelectedThingId] = useState<number>(-1)
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatcher = useAppDispatch()

  useEffect(() => {
    axios
      .get<OneDealDetailed>(`${import.meta.env.VITE_API}/v1/deals/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setDeal(res.data)
      })
      .catch((err) => console.log('Ошибка получения подробной сделки', err))
    dispatcher(fetchGetNot())
      .then()
      .catch((err) => console.log(err))
  }, [id])

  const acceptedHandler = async (): Promise<void> => {
    await axios.patch(
      `${import.meta.env.VITE_API}/v1/deals/${id}/accepted`,
      { selectedThingId },
      { withCredentials: true },
    )
    navigate('/my-deals/from-me')

    // тут запрос в бд и подтверждение сделки
    // затем навигейт на страницу сделки
  }
  const rejectedHandler = async (): Promise<void> => {
    // тут пишемручку на отказ. мб
    await axios.patch(
      `${import.meta.env.VITE_API}/v1/deals/${id}/rejected`,
      {},
      { withCredentials: true },
    )
    navigate('/my-deals/from-me')
    // тут запрос в бд и отказ от сделки
    // затем навигейт на страницу всех своих сделок
  }

  const selectorHandler = (thingId: number): void => {
    setSelectedThingId(thingId)
  }

  // const findSelectedIndex = (things: ) => {

  // }

  return (
    <div className={style.wrapper}>
      <div className={style.textCol}>Моя вещь:</div>
      <div className={style.topLine}>
        <div className={style.oneThing}>
          <CardSimple hoverable thing={deal?.Thing} thingId={deal?.thingId} />
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
              checked={selectedThingId === hisOneThing.id}
            />

            <label
              htmlFor={`thing-${hisOneThing.id}`}
              className={style.radioLabel}
            >
              <div className={style.borderWrapper}>
                <CardSimple hoverable thing={hisOneThing} thingId={hisOneThing.id} />
              </div>
            </label>
            <Button onClick={() => selectorHandler(hisOneThing.id)}>
              выбрать
            </Button>
          </div>
        ))}
      </div>
      <div className={style.selectedText}>
        Выбрано: {deal?.initiatorThings[selectedThingId]?.thingName}
      </div>
      <div className={style.bottomLine}>
        <Button
          disabled={selectedThingId < 0}
          color='good'
          onClick={() => void acceptedHandler()}
        >
          Давай меняться
        </Button>
        <Button color='danger' onClick={() => void rejectedHandler()}>
          Не хочу меняться
        </Button>
      </div>
    </div>
  )
}
