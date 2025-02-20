import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SimplifiedThingType } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import Button from '../../Shared/Button/Button'
import SmallCard from '../../Widgets/smallCard/SmallCard'
import styles from './InitChange.module.css'
import { setIsOpen } from '../../../redux/thing/thingSlice'

type InitChangePropsType = {
  thingId: number
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default function InitChange({
  thingId,
  setActive,
}: InitChangePropsType): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)
  const navigate = useNavigate()
  const dispatsher = useAppDispatch()
  const [myThings, setMyThings] = useState<SimplifiedThingType[]>([])
  const [selectedThings, setSelectedThings] = useState<SimplifiedThingType[]>(
    [],
  )

  useEffect(() => {
    if (user.id) {
      axios
        .get<SimplifiedThingType[]>(
          `${import.meta.env.VITE_API}/v1/things/user/${user.id}`,
          { withCredentials: true },
        )
        .then((res) =>
          setMyThings(res.data.filter((el) => !el.inDeal && el.isApproved)),
        )
        .catch((err) => console.log('Ошибка получения всех СВОИХ вещей', err))
    }
  }, [user])
  // console.log(user, myThings)

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
      if (deal.status === 201) navigate('/my-deals/from-me')
    } catch (error) {
      console.log(error)
    }
  }

  if (!user.id) {
    return (
      <div className={styles.modal}>
        <center>
          <h1>
            чтобы меняться <br /> надо сначала
          </h1>
        </center>
        <Button onClick={() => void navigate('/auth')}>Войти</Button>
      </div>
    )
  }

  if (!myThings.length && !selectedThings.length) {
    return (
      <div className={styles.modal}>
        <center>
          <h1>
            У тебя еще нет <br /> вещей для обмена
          </h1>
        </center>
        <Button
          onClick={() => {
            setActive((prev) => !prev)
            dispatsher(setIsOpen())
          }}
        >
          Добавить вещи
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.wraper}>
      <center>
        <h1>выбери вещи на что ты хочешь поменять</h1>
      </center>
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
        <Button
          disabled={!selectedThings.length}
          onClick={() => void handlerNewDeal()}
        >
          Меняюсь
        </Button>
      </div>
    </div>
  )
}



/*

 <div className={styles.things}>
        <div className={styles.thingsList}>
          {myThings.map((thing) => (
            <button
              type='button'
              key={`myThing-${thing.id}`}
              className={styles.cardBtn}
              onClick={() => handlerAddThing(thing.id)}
            >
              <SmallCard thing={thing} />
            </button>
          ))}
        </div>
        <div className={styles.thingsList}>
          {selectedThings.map((thing) => (
            <button
              type='button'
              key={`myThing-${thing.id}`}
              className={styles.cardBtn}
              onClick={() => handlerRemoveThing(thing.id)}
            >
              <SmallCard thing={thing} />
            </button>
          ))}
        </div>
      </div>

      */