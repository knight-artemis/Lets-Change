import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SimplifiedThingType } from '../../types'
import { useAppSelector } from '../../redux/hooks'
import Button from '../Shared/Button/Button'
import SmallCard from '../Widgets/smallCard/SmallCard'
import styles from './InitChange.module.css'

type InitChangePropsType = {
  thingId: number
}

export default function InitChange({
  thingId,
}: InitChangePropsType): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)
  const navigate = useNavigate()

  const [myThings, setMyThings] = useState<SimplifiedThingType[]>([])
  const [selectedThings, setSelectedThings] = useState<SimplifiedThingType[]>(
    [],
  )

  useEffect(() => {
    axios
      .get<SimplifiedThingType[]>(
        `${import.meta.env.VITE_API}/v1/things/user/${user.id}`,
        { withCredentials: true },
      )
      .then((res) =>
        setMyThings(res.data.filter((el) => !el.inDeal ?? el.isApproved)),
      )
      .catch((err) => console.log('Ошибка получения всех СВОИХ вещей', err))
  }, [user])
  console.log(user, myThings)

  const handlerAddThing = (id: number): void => {
    const thing = myThings.find((el) => el.id === id) as SimplifiedThingType
    setSelectedThings((prev) => [thing, ...prev])
    setMyThings((prev) => prev.filter((el) => el.id !== id))
  }
  const handlerRemoveThing = (id: number): void => {
    const thing = selectedThings.find(
      (el) => el.id === id,
    ) as SimplifiedThingType
    setMyThings((prev) => [thing, ...prev])
    setSelectedThings((prev) => prev.filter((el) => el.id !== id))
  }

  const handlerNewDeal = async (): Promise<void> => {
    const things = selectedThings.map((el) => el.id)

    try {
      const deal = await axios.post(
        `${import.meta.env.VITE_API}/v1/deals`,
        { thingId, things },
        {
          withCredentials: true,
        },
      )
      console.log(deal)
    } catch (error) {
      console.log(error)
    }
    console.log(thingId, things)
  }

  if (!user.id) {
    return (
      <div>
        <h1>чтобы меняться надо сначала войти</h1>
        <Button onClick={() => void navigate('/auth')}>Войти</Button>
      </div>
    )
  }

  if (!myThings.length && !selectedThings.length) {
    return (
      <div>
        <h1>У тебя еще нет вещей для обмена</h1>
        <Button onClick={() => void navigate('/new-thing')}>
          Добавить вещи
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.wraper}>
      <h1>выбери вещи на что ты хочешь поменять</h1>
      <div className={styles.things}>
        <div className={styles.thingsList}>
          {myThings.map((thing) => (
            <Button
              key={`myThing-${thing.id}`}
              link
              onClick={() => handlerAddThing(thing.id)}
            >
              <SmallCard thing={thing} />
            </Button>
          ))}
        </div>
        <div className={styles.thingsList}>
          {selectedThings.map((thing) => (
            <Button
              key={`myThing-${thing.id}`}
              link
              onClick={() => handlerRemoveThing(thing.id)}
            >
              <SmallCard thing={thing} />
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Button disabled={!selectedThings.length} onClick={() => void handlerNewDeal()}>
          Меняюсь
        </Button>
      </div>
    </div>
  )
}
